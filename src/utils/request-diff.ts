import { diffLines, diffWordsWithSpace, type Change } from 'diff';

export type DiffMark = 'eq' | 'add' | 'del';

export interface DiffToken {
  value: string;
  type: DiffMark;
}

export interface DiffRow {
  kind: 'eq' | 'add' | 'del' | 'change';
  left: DiffToken[];
  right: DiffToken[];
  /** Single stream for the mobile unified view (eq + del + add in order). */
  unified: DiffToken[];
}

function changeLines(change: Change): string[] {
  return change.value.replace(/\n$/, '').split('\n');
}

function wholeLine(value: string, type: DiffMark): DiffToken[] {
  return value.length === 0 ? [] : [{ value, type }];
}

function innerTokens(from: string, to: string): {
  left: DiffToken[];
  right: DiffToken[];
  unified: DiffToken[];
} {
  const inner = diffWordsWithSpace(from, to) ?? [];
  const left: DiffToken[] = [];
  const right: DiffToken[] = [];
  const unified: DiffToken[] = [];

  for (const part of inner) {
    if (part.removed) {
      left.push({ value: part.value, type: 'del' });
      unified.push({ value: part.value, type: 'del' });
    } else if (part.added) {
      right.push({ value: part.value, type: 'add' });
      unified.push({ value: part.value, type: 'add' });
    } else {
      const token: DiffToken = { value: part.value, type: 'eq' };
      left.push(token);
      right.push(token);
      unified.push(token);
    }
  }

  return { left, right, unified };
}

function zipChanged(oldLines: string[], newLines: string[]): DiffRow[] {
  const rows: DiffRow[] = [];
  const n = Math.max(oldLines.length, newLines.length);

  for (let i = 0; i < n; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine !== undefined && newLine !== undefined) {
      const { left, right, unified } = innerTokens(oldLine, newLine);
      rows.push({ kind: 'change', left, right, unified });
    } else if (oldLine !== undefined) {
      const left = wholeLine(oldLine, 'del');
      rows.push({ kind: 'del', left, right: [], unified: left });
    } else if (newLine !== undefined) {
      const right = wholeLine(newLine, 'add');
      rows.push({ kind: 'add', left: [], right, unified: right });
    }
  }

  return rows;
}

/**
 * Align two texts into side-by-side rows. Unchanged lines stay paired;
 * replaced lines get a word-level inner diff so JWT segments and JSON
 * fields light up instead of the whole line.
 */
export function alignRequestDiff(left: string, right: string): DiffRow[] {
  const changes = diffLines(left, right, { ignoreNewlineAtEof: true }) ?? [];
  const rows: DiffRow[] = [];
  let i = 0;

  while (i < changes.length) {
    const change = changes[i];
    const next = changes[i + 1];

    if (!change.added && !change.removed) {
      for (const line of changeLines(change)) {
        const tokens = wholeLine(line, 'eq');
        rows.push({ kind: 'eq', left: tokens, right: tokens, unified: tokens });
      }
      i += 1;
      continue;
    }

    if (change.removed && next?.added) {
      rows.push(...zipChanged(changeLines(change), changeLines(next)));
      i += 2;
      continue;
    }

    if (change.removed) {
      for (const line of changeLines(change)) {
        const left = wholeLine(line, 'del');
        rows.push({ kind: 'del', left, right: [], unified: left });
      }
    } else if (change.added) {
      for (const line of changeLines(change)) {
        const right = wholeLine(line, 'add');
        rows.push({ kind: 'add', left: [], right, unified: right });
      }
    }

    i += 1;
  }

  return rows;
}

const PLACEHOLDER = /<[A-Za-z][A-Za-z0-9_-]*>/g;

export interface TextPart {
  text: string;
  placeholder: boolean;
}

/** Split script placeholders like `<lab-url>` so the renderer can restyle them. */
export function splitPlaceholders(value: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;

  PLACEHOLDER.lastIndex = 0;
  for (const match of value.matchAll(PLACEHOLDER)) {
    const start = match.index ?? 0;
    if (start > last) {
      parts.push({ text: value.slice(last, start), placeholder: false });
    }
    parts.push({ text: match[0], placeholder: true });
    last = start + match[0].length;
  }

  if (last < value.length) {
    parts.push({ text: value.slice(last), placeholder: false });
  }

  if (parts.length === 0 && value.length > 0) {
    parts.push({ text: value, placeholder: false });
  }

  return parts;
}

export function prettyIfJson(code: string, file: string): string {
  if (!file.endsWith('.json')) return code;
  try {
    return JSON.stringify(JSON.parse(code), null, 2);
  } catch {
    return code;
  }
}

const JWT_SEGMENT = /^[A-Za-z0-9_-]+$/;
const JWT_COMPACT = /[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g;
const JWT_LONE = /[A-Za-z0-9_-]+/g;

export interface JwtParts {
  header: string;
  payload: string;
  signature: string;
  headerJson: string | null;
  payloadJson: string | null;
}

export interface JwtTipRange {
  start: number;
  end: number;
  kind: 'header' | 'payload' | 'signature';
  decoded: string | null;
}

function overlapsRange(
  a: { start: number; end: number },
  b: { start: number; end: number },
): boolean {
  return a.start < b.end && a.end > b.start;
}

function isJsonObject(json: string): boolean {
  try {
    const value = JSON.parse(json) as unknown;
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  } catch {
    return false;
  }
}

function jwtJsonKind(json: string): 'header' | 'payload' {
  try {
    const value = JSON.parse(json) as Record<string, unknown>;
    if (value && typeof value === 'object' && 'alg' in value) return 'header';
  } catch {
    /* payload */
  }
  return 'payload';
}

/** Decode a Base64URL JWT segment into pretty JSON, or null if it is not JSON. */
export function decodeJwtJson(segment: string): string | null {
  try {
    const padded =
      segment.replace(/-/g, '+').replace(/_/g, '/') +
      '='.repeat((4 - (segment.length % 4)) % 4);
    const json = Buffer.from(padded, 'base64').toString('utf8');
    const pretty = JSON.stringify(JSON.parse(json), null, 2);
    return isJsonObject(pretty) ? pretty : null;
  } catch {
    return null;
  }
}

/** Parse a compact JWT (`header.payload.signature`) and pretty-print the JSON parts. */
export function parseJwt(value: string): JwtParts | null {
  const parts = value.trim().split('.');
  if (parts.length !== 3 || parts.some((part) => !JWT_SEGMENT.test(part))) {
    return null;
  }
  const [header, payload, signature] = parts as [string, string, string];
  const headerJson = decodeJwtJson(header);
  const payloadJson = decodeJwtJson(payload);
  if (!headerJson && !payloadJson) return null;
  return { header, payload, signature, headerJson, payloadJson };
}

/**
 * Locate hoverable JWT header/payload spans in a line of script text.
 * Compact tokens (`header.payload.signature`) and lone `eyJ…` segments
 * (as in `echo "eyJ…" | base64 -d`) both count. Dots stay unwrapped.
 */
export function findJwtTips(text: string): JwtTipRange[] {
  const tips: JwtTipRange[] = [];
  const taken: { start: number; end: number }[] = [];

  JWT_COMPACT.lastIndex = 0;
  for (const match of text.matchAll(JWT_COMPACT)) {
    const jwt = parseJwt(match[0]);
    if (!jwt) continue;
    const start = match.index ?? 0;
    const headerEnd = start + jwt.header.length;
    const payloadStart = headerEnd + 1;
    const payloadEnd = payloadStart + jwt.payload.length;
    if (jwt.headerJson) {
      tips.push({ start, end: headerEnd, kind: 'header', decoded: jwt.headerJson });
    }
    if (jwt.payloadJson) {
      tips.push({
        start: payloadStart,
        end: payloadEnd,
        kind: 'payload',
        decoded: jwt.payloadJson,
      });
    }
    tips.push({
      start: payloadEnd + 1,
      end: start + match[0].length,
      kind: 'signature',
      decoded: null,
    });
    taken.push({ start, end: start + match[0].length });
  }

  JWT_LONE.lastIndex = 0;
  for (const match of text.matchAll(JWT_LONE)) {
    const raw = match[0];
    if (!raw.startsWith('eyJ')) continue;
    const start = match.index ?? 0;
    const end = start + raw.length;
    if (taken.some((range) => overlapsRange(range, { start, end }))) continue;
    const decoded = decodeJwtJson(raw);
    if (!decoded) continue;
    tips.push({ start, end, kind: jwtJsonKind(decoded), decoded });
  }

  return tips.sort((a, b) => a.start - b.start);
}
