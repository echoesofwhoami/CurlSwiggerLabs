import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { diffLines, diffWordsWithSpace, type Change } from 'diff'
import type {
  DiffLineView,
  DiffMark,
  DiffModes,
  DiffPartView,
  DiffRow,
  DiffToken,
  JwtChangeFlags,
  JwtParts,
  JwtSegmentView,
  JwtTipRange,
  LoadedDiff,
  RequestDiffLoadInput,
  RequestDiffSideView,
  RequestDiffView,
  SideBuild,
  TextPart,
} from '@types'

export type { DiffMark, DiffRow, DiffToken, JwtParts, JwtTipRange, TextPart }

function changeLines(change: Change): string[] {
  return change.value.replace(/\n$/, '').split('\n')
}

function wholeLine(value: string, type: DiffMark): DiffToken[] {
  if (value.length === 0) return []

  return [{ value, type }]
}

function innerTokens(from: string, to: string): {
  left: DiffToken[];
  right: DiffToken[];
  unified: DiffToken[];
} {
  const inner = diffWordsWithSpace(from, to) ?? []

  const left: DiffToken[] = []

  const right: DiffToken[] = []

  const unified: DiffToken[] = []

  for (const part of inner) {
    if (part.removed) {
      left.push({ value: part.value, type: 'del' })

      unified.push({ value: part.value, type: 'del' })
    } else if (part.added) {
      right.push({ value: part.value, type: 'add' })

      unified.push({ value: part.value, type: 'add' })
    } else {
      const token: DiffToken = { value: part.value, type: 'eq' }

      left.push(token)

      right.push(token)

      unified.push(token)
    }
  }

  return { left, right, unified }
}

function zipChanged(oldLines: string[], newLines: string[]): DiffRow[] {
  const rows: DiffRow[] = []

  const n = Math.max(oldLines.length, newLines.length)

  for (let i = 0; i < n; i++) {
    const oldLine = oldLines[i]

    const newLine = newLines[i]

    if (oldLine !== undefined && newLine !== undefined) {
      const { left, right, unified } = innerTokens(oldLine, newLine)

      rows.push({ kind: 'change', left, right, unified })
    } else if (oldLine !== undefined) {
      const left = wholeLine(oldLine, 'del')

      rows.push({ kind: 'del', left, right: [], unified: left })
    } else if (newLine !== undefined) {
      const right = wholeLine(newLine, 'add')

      rows.push({ kind: 'add', left: [], right, unified: right })
    }
  }

  return rows
}

/**
 * Align two texts into side-by-side rows. Unchanged lines stay paired;
 * replaced lines get a word-level inner diff so JWT segments and JSON
 * fields light up instead of the whole line.
 */
export function alignRequestDiff(left: string, right: string): DiffRow[] {
  const changes = diffLines(left, right, { ignoreNewlineAtEof: true }) ?? []

  const rows: DiffRow[] = []

  let i = 0

  while (i < changes.length) {
    const change = changes[i]

    const next = changes[i + 1]

    if (!change.added && !change.removed) {
      for (const line of changeLines(change)) {
        const tokens = wholeLine(line, 'eq')

        rows.push({ kind: 'eq', left: tokens, right: tokens, unified: tokens })
      }

      i += 1

      continue
    }

    if (change.removed && next?.added) {
      rows.push(...zipChanged(changeLines(change), changeLines(next)))

      i += 2

      continue
    }

    if (change.removed) {
      for (const line of changeLines(change)) {
        const left = wholeLine(line, 'del')

        rows.push({ kind: 'del', left, right: [], unified: left })
      }
    } else if (change.added) {
      for (const line of changeLines(change)) {
        const right = wholeLine(line, 'add')

        rows.push({ kind: 'add', left: [], right, unified: right })
      }
    }

    i += 1
  }

  return rows
}

const PLACEHOLDER = /<[A-Za-z][A-Za-z0-9_-]*>/g

/** Split script placeholders like `<lab-url>` so the renderer can restyle them. */
export function splitPlaceholders(value: string): TextPart[] {
  const parts: TextPart[] = []

  let last = 0

  PLACEHOLDER.lastIndex = 0

  for (const match of value.matchAll(PLACEHOLDER)) {
    const start = match.index ?? 0

    if (start > last) {
      parts.push({ text: value.slice(last, start), placeholder: false })
    }

    parts.push({ text: match[0], placeholder: true })

    last = start + match[0].length
  }

  if (last < value.length) {
    parts.push({ text: value.slice(last), placeholder: false })
  }

  if (parts.length === 0 && value.length > 0) {
    parts.push({ text: value, placeholder: false })
  }

  return parts
}

export function prettyIfJson(code: string, file: string): string {
  if (!file.endsWith('.json')) return code

  try {
    return JSON.stringify(JSON.parse(code), null, 2)
  } catch {
    return code
  }
}

const scriptsRoot = join(process.cwd(), 'src/data/scripts')

export const jwtTipTerms = {
  header: 'Header',
  payload: 'Payload',
  signature: 'Signature',
  signatureHint:
    'This is a signature, not JSON. Decoding it as Base64 will not produce a readable object.',
}

const JWT_SEGMENT = /^[A-Za-z0-9_-]+$/

const JWT_COMPACT = /[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g

const JWT_LONE = /[A-Za-z0-9_-]+/g

function overlapsRange(
  a: { start: number; end: number },
  b: { start: number; end: number },
): boolean {
  return a.start < b.end && a.end > b.start
}

function isJsonObject(json: string): boolean {
  try {
    const value = JSON.parse(json) as unknown

    return typeof value === 'object' && value !== null && !Array.isArray(value)
  } catch {
    return false
  }
}

function jwtJsonKind(json: string): 'header' | 'payload' {
  try {
    const value = JSON.parse(json) as Record<string, unknown>

    if (value && typeof value === 'object' && 'alg' in value) return 'header'
  } catch {
    /* payload */
  }

  return 'payload'
}

/** Decode a Base64URL JWT segment into pretty JSON, or undefined if it is not JSON. */
export function decodeJwtJson(segment: string): string | undefined {
  try {
    const padded =
      segment.replace(/-/g, '+').replace(/_/g, '/') +
      '='.repeat((4 - (segment.length % 4)) % 4)

    const json = Buffer.from(padded, 'base64').toString('utf8')

    const pretty = JSON.stringify(JSON.parse(json), null, 2)

    if (!isJsonObject(pretty)) return

    return pretty
  } catch {
    return
  }
}

/** Parse a compact JWT (`header.payload.signature`) and pretty-print the JSON parts. */
export function parseJwt(value: string): JwtParts | undefined {
  const parts = value.trim().split('.')

  if (parts.length !== 3 || parts.some((part) => !JWT_SEGMENT.test(part))) {
    return
  }

  const [header, payload, signature] = parts as [string, string, string]

  const headerJson = decodeJwtJson(header)

  const payloadJson = decodeJwtJson(payload)

  if (!headerJson && !payloadJson) return

  return { header, payload, signature, headerJson, payloadJson }
}

/**
 * Locate hoverable JWT header/payload spans in a line of script text.
 * Compact tokens (`header.payload.signature`) and lone `eyJ…` segments
 * (as in `echo "eyJ…" | base64 -d`) both count. Dots stay unwrapped.
 */
export function findJwtTips(text: string): JwtTipRange[] {
  const tips: JwtTipRange[] = []

  const taken: { start: number; end: number }[] = []

  JWT_COMPACT.lastIndex = 0

  for (const match of text.matchAll(JWT_COMPACT)) {
    const jwt = parseJwt(match[0])

    if (!jwt) continue

    const start = match.index ?? 0

    const headerEnd = start + jwt.header.length

    const payloadStart = headerEnd + 1

    const payloadEnd = payloadStart + jwt.payload.length

    if (jwt.headerJson) {
      tips.push({ start, end: headerEnd, kind: 'header', decoded: jwt.headerJson })
    }

    if (jwt.payloadJson) {
      tips.push({
        start: payloadStart,
        end: payloadEnd,
        kind: 'payload',
        decoded: jwt.payloadJson,
      })
    }

    tips.push({
      start: payloadEnd + 1,
      end: start + match[0].length,
      kind: 'signature',
      decoded: undefined,
    })

    taken.push({ start, end: start + match[0].length })
  }

  JWT_LONE.lastIndex = 0

  for (const match of text.matchAll(JWT_LONE)) {
    const raw = match[0]

    if (!raw.startsWith('eyJ')) continue

    const start = match.index ?? 0

    const end = start + raw.length

    if (taken.some((range) => overlapsRange(range, { start, end }))) continue

    const decoded = decodeJwtJson(raw)

    if (!decoded) continue

    tips.push({ start, end, kind: jwtJsonKind(decoded), decoded })
  }

  return tips.sort((a, b) => a.start - b.start)
}

export function loadRequestDiff(input: RequestDiffLoadInput): RequestDiffView {
  const loaded = loadDiffSources(input)

  return deriveRequestDiff(loaded, input)
}

function loadDiffSources(input: RequestDiffLoadInput): LoadedDiff {
  const left = readPrettyScript(input.left)

  const right = readPrettyScript(input.right)

  return { left, right }
}

function readPrettyScript(file: string): string {
  const raw = readFileSync(join(scriptsRoot, file), 'utf-8').replace(/\n$/, '')

  return prettyIfJson(raw, file)
}

function deriveRequestDiff(loaded: LoadedDiff, input: RequestDiffLoadInput): RequestDiffView {
  const rows = alignRequestDiff(loaded.left, loaded.right)

  const leftJwt = parseJwt(loaded.left)

  const rightJwt = parseJwt(loaded.right)

  const modes = diffModes(input.left, input.right, leftJwt, rightJwt)

  const changes = jwtChanges(leftJwt, rightJwt)

  const sides = [
    buildSide({
      id: 'left',
      label: input.leftLabel,
      fallback: 'Original',
      active: false,
      jwt: leftJwt,
      rows,
      jwtMode: modes.jwtMode,
      changes,
      tipAction: input.tipAction,
    }),
    buildSide({
      id: 'right',
      label: input.rightLabel,
      fallback: 'Exploit',
      active: true,
      jwt: rightJwt,
      rows,
      jwtMode: modes.jwtMode,
      changes,
      tipAction: input.tipAction,
    }),
  ]

  return {
    leftRaw: loaded.left,
    rightRaw: loaded.right,
    jsonMode: modes.jsonMode,
    httpMode: modes.httpMode,
    jwtMode: modes.jwtMode,
    diffId: `rd-${input.slugify(input.left)}-${input.slugify(input.right)}`,
    activePanel: activePanelName(sides),
    sides,
  }
}

function diffModes(
  leftFile: string,
  rightFile: string,
  leftJwt: JwtParts | undefined,
  rightJwt: JwtParts | undefined,
): DiffModes {
  const jwtMode = leftJwt !== undefined && rightJwt !== undefined

  if (jwtMode) return { jwtMode, jsonMode: false, httpMode: false }

  const jsonMode = leftFile.endsWith('.json') || rightFile.endsWith('.json')

  if (jsonMode) return { jwtMode, jsonMode, httpMode: false }

  const httpMode = leftFile.endsWith('.http') || rightFile.endsWith('.http')

  return { jwtMode, jsonMode, httpMode }
}

function jwtChanges(left: JwtParts | undefined, right: JwtParts | undefined): JwtChangeFlags {
  if (!left || !right) {
    return { header: false, payload: false, signature: false }
  }

  return {
    header: left.header !== right.header,
    payload: left.payload !== right.payload,
    signature: left.signature !== right.signature,
  }
}

function buildSide(options: SideBuild): RequestDiffSideView {
  return {
    id: options.id,
    title: sideTitle(options.label, options.fallback),
    active: options.active,
    labelClass: sideLabelClass(options.id),
    swatchClass: sideSwatchClass(options.id),
    selected: selectedState(options.active),
    hidden: panelHidden(options.active),
    segments: segmentsFor(options),
    lines: linesFor(options.rows, options.id, options.jwtMode),
  }
}

function sideTitle(label: string | undefined, fallback: string): string {
  if (!label) return fallback

  return label
}

function sideLabelClass(side: 'left' | 'right'): string {
  if (side === 'left') return 'is-del'

  return 'is-add'
}

function sideSwatchClass(side: 'left' | 'right'): string {
  if (side === 'left') return 'del'

  return 'add'
}

function selectedState(active: boolean): 'true' | 'false' {
  if (active) return 'true'

  return 'false'
}

function panelHidden(active: boolean): true | undefined {
  if (active) return

  return true
}

function activePanelName(sides: RequestDiffSideView[]): string {
  for (const side of sides) {
    if (side.active) return side.id
  }

  return 'right'
}

function linesFor(rows: DiffRow[], side: 'left' | 'right', jwtMode: boolean): DiffLineView[] {
  if (jwtMode) return []

  const lines: DiffLineView[] = []

  for (const row of rows) {
    const parts = tokenParts(tokensFor(row, side))

    if (parts.length === 0) continue

    lines.push({ kind: row.kind, parts })
  }

  return lines
}

function tokensFor(row: DiffRow, side: 'left' | 'right'): DiffToken[] {
  if (side === 'left') return row.left

  return row.right
}

function tokenParts(tokens: DiffToken[]): DiffPartView[] {
  const parts: DiffPartView[] = []

  for (const token of tokens) {
    for (const piece of splitPlaceholders(token.value)) {
      parts.push({
        text: piece.text,
        type: token.type,
        placeholder: piece.placeholder,
      })
    }
  }

  return parts
}

function segmentsFor(options: SideBuild): JwtSegmentView[] {
  if (!options.jwtMode || !options.jwt) return []

  const jwt = options.jwt

  return [
    jwtSegment(
      jwt.header,
      jwt.headerJson,
      undefined,
      jwtTipTerms.header,
      jwtMark(options.changes.header, options.id),
      true,
      options.tipAction,
    ),
    jwtSegment(
      jwt.payload,
      jwt.payloadJson,
      undefined,
      jwtTipTerms.payload,
      jwtMark(options.changes.payload, options.id),
      true,
      options.tipAction,
    ),
    jwtSegment(
      jwt.signature,
      undefined,
      jwtTipTerms.signatureHint,
      jwtTipTerms.signature,
      jwtMark(options.changes.signature, options.id),
      false,
      options.tipAction,
    ),
  ]
}

function jwtMark(changed: boolean, side: 'left' | 'right'): DiffMark {
  if (!changed) return 'eq'

  if (side === 'left') return 'del'

  return 'add'
}

function jwtSegment(
  text: string,
  decoded: string | undefined,
  short: string | undefined,
  term: string,
  mark: DiffMark,
  dot: boolean,
  tipAction: string,
): JwtSegmentView {
  const hoverable = segmentHoverable(decoded, short)

  const view: JwtSegmentView = { text, mark, dot, hoverable }

  if (!hoverable) return view

  view.term = term

  view.role = 'button'

  view.tabindex = '0'

  view.expanded = 'false'

  view.action = tipAction

  if (decoded) view.decode = decoded

  if (short) view.short = short

  return view
}

function segmentHoverable(decoded: string | undefined, short: string | undefined): boolean {
  if (decoded) return true

  if (short) return true

  return false
}
