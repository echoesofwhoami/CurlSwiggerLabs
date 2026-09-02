import type { Element, ElementContent, Text } from 'hast';
import type { ShikiTransformer, ShikiTransformerContextMeta } from 'shiki';
import {
  entriesMatching,
  getEntry,
  isFirstOnly,
  type GlossaryEntry,
  type GlossaryLang,
} from '../data/glossary';
import { useTranslations } from '../i18n/utils';
import { findJwtTips } from '../utils/request-diff';

const PLACEHOLDER = /<[A-Za-z][A-Za-z0-9_-]*>/g;
const SEEN_KEY = '__curlswiggerTipSeen';
const WORD_CHAR = /[A-Za-z0-9_]/;

interface TransformerOpts {
  codeLang?: string;
  extraTips?: Record<string, string>;
  collector?: Set<string>;
}

interface Candidate {
  token: string;
  entry: GlossaryEntry;
  fromExtra: boolean;
}

interface Leaf {
  start: number;
  end: number;
  value: string;
  style: string;
  inComment: boolean;
}

interface TextRange {
  start: number;
  end: number;
}

interface GlossaryWrap {
  start: number;
  end: number;
  text: string;
  entry: GlossaryEntry;
  fromExtra: boolean;
}

interface JwtWrap {
  start: number;
  end: number;
  term: string;
  decoded?: string;
  short?: string;
}

type LineWrap = GlossaryWrap | JwtWrap;

function isJwtWrap(wrap: LineWrap): wrap is JwtWrap {
  return !('entry' in wrap);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isWordLike(token: string): boolean {
  return token.length > 0 && WORD_CHAR.test(token[0]!) && WORD_CHAR.test(token[token.length - 1]!);
}

/**
 * HTTP field names (`Cookie`, `Set-Cookie`, `set-cookie`, `X-Ignore`, `GET`).
 * `-` is not a word char, so `\bCookie\b` would otherwise match inside `Set-Cookie`.
 */
function isHeaderLike(token: string): boolean {
  if (token.includes('-')) {
    return /^[A-Za-z][A-Za-z0-9]*(-[A-Za-z0-9]+)+$/.test(token);
  }
  return /^[A-Z][A-Za-z0-9]*$/.test(token) || /^(location|cookie|host|connection|authorization)$/.test(token);
}

function headerBoundariesOk(line: string, start: number, end: number): boolean {
  const prev = start === 0 ? '' : line[start - 1]!;
  const next = end >= line.length ? '' : line[end]!;
  if (prev && /[-A-Za-z0-9]/.test(prev)) return false;
  if (next && /[-A-Za-z0-9]/.test(next)) return false;
  return true;
}

/** curl-style flags: `-H`, `-c`, `--http1.1`. Not path tokens like `../`. */
const FLAG_TOKEN = /^--?[A-Za-z0-9][A-Za-z0-9._-]*$/;
const BASE64_CHAR = /[A-Za-z0-9+/=_-]/;
const BASE64_RUN_MIN = 24;

function isFlagToken(token: string): boolean {
  return FLAG_TOKEN.test(token);
}

function flagBoundariesOk(line: string, start: number, end: number): boolean {
  const prev = start === 0 ? '' : line[start - 1]!;
  const next = end >= line.length ? '' : line[end]!;
  if (prev && !/[\s"'`([<{]/.test(prev)) return false;
  if (next && !/[\s"'`=,\])}>\\]/.test(next)) return false;
  return true;
}

function insideLongBase64Run(line: string, start: number, end: number): boolean {
  let i = start;
  while (i > 0 && BASE64_CHAR.test(line[i - 1]!)) i--;
  let j = end;
  while (j < line.length && BASE64_CHAR.test(line[j]!)) j++;
  return j - i >= BASE64_RUN_MIN;
}

function classText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(String).join(' ');
  return '';
}

function elementIsComment(el: Element): boolean {
  if (classText(el.properties?.class).toLowerCase().includes('comment')) return true;
  const style = typeof el.properties?.style === 'string' ? el.properties.style : '';
  return style.includes('--shiki-token-comment');
}

function coveringStyle(ancestors: Element[]): string {
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const style = ancestors[i]?.properties?.style;
    if (typeof style === 'string' && style) return style;
  }
  return '';
}

function resolveCodeLang(explicit: string | undefined, shikiLang: unknown): string {
  if (explicit) return explicit;
  if (typeof shikiLang === 'string') return shikiLang;
  if (shikiLang && typeof shikiLang === 'object' && 'name' in shikiLang) {
    const name = (shikiLang as { name: unknown }).name;
    if (typeof name === 'string') return name;
  }
  return '';
}

function seenIds(meta: ShikiTransformerContextMeta): Set<string> {
  const bag = meta as Record<string, unknown>;
  const existing = bag[SEEN_KEY];
  if (existing instanceof Set) return existing as Set<string>;
  const created = new Set<string>();
  bag[SEEN_KEY] = created;
  return created;
}

function placeholderRanges(line: string): TextRange[] {
  PLACEHOLDER.lastIndex = 0;
  const ranges: TextRange[] = [];
  for (const match of line.matchAll(PLACEHOLDER)) {
    const start = match.index ?? 0;
    ranges.push({ start, end: start + match[0].length });
  }
  return ranges;
}

function overlaps(a: TextRange, b: TextRange): boolean {
  return a.start < b.end && a.end > b.start;
}

function collectLeaves(line: Element): { text: string; leaves: Leaf[] } {
  const leaves: Leaf[] = [];
  let offset = 0;

  const walk = (el: Element, ancestors: Element[]) => {
    for (const child of el.children) {
      if (child.type === 'text') {
        const value = child.value;
        leaves.push({
          start: offset,
          end: offset + value.length,
          value,
          style: coveringStyle(ancestors),
          inComment: ancestors.some((node) => node !== line && elementIsComment(node)),
        });
        offset += value.length;
      } else if (child.type === 'element') {
        walk(child, [...ancestors, child]);
      }
    }
  };

  walk(line, [line]);
  return { text: leaves.map((leaf) => leaf.value).join(''), leaves };
}

function locateToken(line: string, token: string): TextRange[] {
  if (!token) return [];
  const found: TextRange[] = [];
  if (isWordLike(token)) {
    const header = isHeaderLike(token);
    const re = new RegExp(`\\b${escapeRegExp(token)}\\b`, 'g');
    for (const match of line.matchAll(re)) {
      const start = match.index ?? 0;
      const end = start + token.length;
      if (header && !headerBoundariesOk(line, start, end)) continue;
      if (!header && ((start > 0 && line[start - 1] === '-') || (end < line.length && line[end] === '-'))) {
        continue;
      }
      found.push({ start, end });
    }
    return found;
  }
  const flag = isFlagToken(token);
  let from = 0;
  while (from <= line.length - token.length) {
    const start = line.indexOf(token, from);
    if (start === -1) break;
    const end = start + token.length;
    from = start + 1;
    if (flag && !flagBoundariesOk(line, start, end)) continue;
    if (flag && insideLongBase64Run(line, start, end)) continue;
    found.push({ start, end });
  }
  return found;
}

function rangeIsComment(leaves: Leaf[], range: TextRange): boolean {
  const covering = leaves.filter((leaf) => overlaps(leaf, range));
  return covering.length > 0 && covering.every((leaf) => leaf.inComment);
}

function buildCandidates(codeLang: string, extraTips: Record<string, string> | undefined): Candidate[] {
  const candidates: Candidate[] = [];
  for (const entry of entriesMatching(codeLang)) {
    for (const token of entry.match?.tokens ?? []) {
      if (token) candidates.push({ token, entry, fromExtra: false });
    }
  }
  if (extraTips) {
    for (const [token, id] of Object.entries(extraTips)) {
      if (!token) continue;
      const entry = getEntry(id);
      if (!entry) continue;
      candidates.push({ token, entry, fromExtra: true });
    }
  }
  candidates.sort((a, b) => b.token.length - a.token.length);
  return candidates;
}

function styledText(value: string, style: string): Element {
  return {
    type: 'element',
    tagName: 'span',
    properties: style ? { style } : {},
    children: [{ type: 'text', value } satisfies Text],
  };
}

function jwtTip(wrap: JwtWrap, leaves: Leaf[]): Element {
  const children: ElementContent[] = [];
  for (const leaf of leaves) {
    const start = Math.max(wrap.start, leaf.start);
    const end = Math.min(wrap.end, leaf.end);
    if (start >= end) continue;
    children.push(
      styledText(leaf.value.slice(start - leaf.start, end - leaf.start), leaf.style),
    );
  }
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      class: 'tip tip--syntax',
      'data-tip-term': wrap.term,
      ...(wrap.decoded ? { 'data-tip-decode': wrap.decoded } : {}),
      ...(wrap.short ? { 'data-tip-short': wrap.short } : {}),
      role: 'button',
      tabindex: '0',
      'aria-expanded': 'false',
    },
    children: children.length > 0 ? children : [{ type: 'text', value: '' } satisfies Text],
  };
}

function tipButton(entry: GlossaryEntry, leaves: Leaf[], range: TextRange): Element {
  const children: ElementContent[] = [];
  for (const leaf of leaves) {
    const start = Math.max(range.start, leaf.start);
    const end = Math.min(range.end, leaf.end);
    if (start >= end) continue;
    children.push(
      styledText(leaf.value.slice(start - leaf.start, end - leaf.start), leaf.style),
    );
  }
  return {
    type: 'element',
    tagName: 'button',
    properties: {
      type: 'button',
      class: `tip tip--${entry.kind}`,
      'data-tip-id': entry.id,
      'aria-expanded': 'false',
    },
    children: children.length > 0 ? children : [{ type: 'text', value: '' } satisfies Text],
  };
}

function applyWraps(line: Element, leaves: Leaf[], matches: LineWrap[]): void {
  const out: ElementContent[] = [];
  const lineEnd = leaves.at(-1)?.end ?? 0;
  let pos = 0;

  const emitPlain = (from: number, to: number) => {
    if (from >= to) return;
    for (const leaf of leaves) {
      const start = Math.max(from, leaf.start);
      const end = Math.min(to, leaf.end);
      if (start >= end) continue;
      out.push(styledText(leaf.value.slice(start - leaf.start, end - leaf.start), leaf.style));
    }
  };

  for (const match of matches) {
    emitPlain(pos, match.start);
    out.push(
      isJwtWrap(match) ? jwtTip(match, leaves) : tipButton(match.entry, leaves, match),
    );
    pos = match.end;
  }
  emitPlain(pos, lineEnd);
  line.children = out;
}

/**
 * Wrap glossary tokens in highlighted code with `<button class="tip">`.
 * JWT header/payload segments get the same popover with decoded JSON.
 * `lang` is the post locale; copy lives in the glossary JSON, not on the button.
 */
export function tooltipTransformer(
  lang: GlossaryLang,
  opts?: TransformerOpts,
): ShikiTransformer {
  const t = useTranslations(lang);
  const jwtTerms = {
    header: t('diff.jwtHeader'),
    payload: t('diff.jwtPayload'),
    signature: t('diff.jwtSignature'),
    signatureHint: t('diff.jwtSignatureHint'),
  };

  return {
    name: 'curlswigger-tooltips',
    line(hast: Element) {
      const { text, leaves } = collectLeaves(hast);
      if (!text) return;

      const holes = placeholderRanges(text);
      const occupied: TextRange[] = [];
      const wraps: LineWrap[] = [];

      for (const tip of findJwtTips(text)) {
        const range = { start: tip.start, end: tip.end };
        if (holes.some((hole) => overlaps(hole, range))) continue;
        occupied.push(range);
        if (tip.kind === 'signature') {
          wraps.push({
            start: tip.start,
            end: tip.end,
            term: jwtTerms.signature,
            short: jwtTerms.signatureHint,
          });
        } else if (tip.decoded) {
          wraps.push({
            start: tip.start,
            end: tip.end,
            term: jwtTerms[tip.kind],
            decoded: tip.decoded,
          });
        }
      }

      const codeLang = resolveCodeLang(opts?.codeLang, this.options.lang);
      const candidates = buildCandidates(codeLang, opts?.extraTips);
      const found: GlossaryWrap[] = [];

      for (const candidate of candidates) {
        for (const range of locateToken(text, candidate.token)) {
          if (occupied.some((prev) => overlaps(prev, range))) continue;
          if (holes.some((hole) => overlaps(hole, range))) continue;
          if (rangeIsComment(leaves, range)) continue;

          occupied.push(range);
          found.push({
            start: range.start,
            end: range.end,
            text: text.slice(range.start, range.end),
            entry: candidate.entry,
            fromExtra: candidate.fromExtra,
          });
        }
      }

      const seen = seenIds(this.meta);
      for (const match of found) {
        if (!match.fromExtra && isFirstOnly(match.entry) && seen.has(match.entry.id)) {
          continue;
        }
        wraps.push(match);
        opts?.collector?.add(match.entry.id);
        if (!match.fromExtra && isFirstOnly(match.entry)) {
          seen.add(match.entry.id);
        }
      }

      if (wraps.length === 0) return;
      wraps.sort((a, b) => a.start - b.start);
      applyWraps(hast, leaves, wraps);
    },
  };
}
