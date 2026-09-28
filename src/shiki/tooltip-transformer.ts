import type { Element, ElementContent, Properties, Text } from 'hast'
import type { ShikiTransformer, ShikiTransformerContextMeta } from 'shiki'
import {
  entriesMatching,
  getEntry,
  isFirstOnly,
} from '@data/glossary'
import type {
  Candidate,
  GlossaryEntry,
  GlossaryWrap,
  JwtWrap,
  Leaf,
  LineWrap,
  TextRange,
  TransformerOpts,
} from '@types'
import { findJwtTips, jwtTipTerms } from '@utils/request-diff'

export const tooltipActions = [
  'mouseenter->tooltip#enter',
  'mouseleave->tooltip#leave',
  'focus->tooltip#focusIn',
  'blur->tooltip#focusOut',
  'click->tooltip#pin',
  'keydown->tooltip#keydown',
].join(' ')

const PLACEHOLDER = /<[A-Za-z][A-Za-z0-9_-]*>/g

const SEEN_KEY = '__curlswiggerTipSeen'

const WORD_CHAR = /[A-Za-z0-9_]/

function isJwtWrap(wrap: LineWrap): wrap is JwtWrap {
  return !('entry' in wrap)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isWordLike(token: string): boolean {
  const first = token[0]

  const last = token[token.length - 1]

  if (!first || !last) return false

  return WORD_CHAR.test(first) && WORD_CHAR.test(last)
}

function charAt(line: string, index: number): string {
  if (index < 0 || index >= line.length) return ''

  const char = line[index]

  if (!char) return ''

  return char
}

/**
 * HTTP field names (`Cookie`, `Set-Cookie`, `set-cookie`, `X-Ignore`, `GET`).
 * `-` is not a word char, so `\bCookie\b` would otherwise match inside `Set-Cookie`.
 */
function isHeaderLike(token: string): boolean {
  if (token.includes('-')) {
    return /^[A-Za-z][A-Za-z0-9]*(-[A-Za-z0-9]+)+$/.test(token)
  }

  return /^[A-Z][A-Za-z0-9]*$/.test(token) || /^(location|cookie|host|connection|authorization)$/.test(token)
}

function headerBoundariesOk(line: string, start: number, end: number): boolean {
  const prev = charAt(line, start - 1)

  const next = charAt(line, end)

  if (prev && /[-A-Za-z0-9]/.test(prev)) return false

  if (next && /[-A-Za-z0-9]/.test(next)) return false

  return true
}

/** curl-style flags: `-H`, `-c`, `--http1.1`. Not path tokens like `../`. */
const FLAG_TOKEN = /^--?[A-Za-z0-9][A-Za-z0-9._-]*$/

const BASE64_CHAR = /[A-Za-z0-9+/=_-]/

const BASE64_RUN_MIN = 24

function isFlagToken(token: string): boolean {
  return FLAG_TOKEN.test(token)
}

function flagBoundariesOk(line: string, start: number, end: number): boolean {
  const prev = charAt(line, start - 1)

  const next = charAt(line, end)

  if (prev && !/[\s"'`([<{]/.test(prev)) return false

  if (next && !/[\s"'`=,\])}>\\]/.test(next)) return false

  return true
}

function insideLongBase64Run(line: string, start: number, end: number): boolean {
  let i = start

  while (i > 0 && BASE64_CHAR.test(charAt(line, i - 1))) i--

  let j = end

  while (j < line.length && BASE64_CHAR.test(charAt(line, j))) j++

  return j - i >= BASE64_RUN_MIN
}

function classText(value: unknown): string {
  if (typeof value === 'string') return value

  if (Array.isArray(value)) return value.map(String).join(' ')

  return ''
}

function elementIsComment(el: Element): boolean {
  if (classText(el.properties?.class).toLowerCase().includes('comment')) return true

  const style = el.properties?.style

  if (typeof style !== 'string') return false

  return style.includes('--shiki-token-comment')
}

function coveringStyle(ancestors: Element[]): string {
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const style = ancestors[i]?.properties?.style

    if (typeof style === 'string' && style) return style
  }

  return ''
}

function resolveCodeLang(explicit: string | undefined, shikiLang: unknown): string {
  if (explicit) return explicit

  if (typeof shikiLang === 'string') return shikiLang

  if (shikiLang && typeof shikiLang === 'object' && 'name' in shikiLang) {
    const name = (shikiLang as { name: unknown }).name

    if (typeof name === 'string') return name
  }

  return ''
}

function seenIds(meta: ShikiTransformerContextMeta): Set<string> {
  const bag = meta as Record<string, unknown>

  const existing = bag[SEEN_KEY]

  if (existing instanceof Set) return existing as Set<string>

  const created = new Set<string>()

  bag[SEEN_KEY] = created

  return created
}

function placeholderRanges(line: string): TextRange[] {
  PLACEHOLDER.lastIndex = 0

  const ranges: TextRange[] = []

  for (const match of line.matchAll(PLACEHOLDER)) {
    const start = match.index ?? 0

    ranges.push({ start, end: start + match[0].length })
  }

  return ranges
}

function overlaps(a: TextRange, b: TextRange): boolean {
  return a.start < b.end && a.end > b.start
}

function collectLeaves(line: Element): { text: string; leaves: Leaf[] } {
  const leaves: Leaf[] = []

  let offset = 0

  const walk = (el: Element, ancestors: Element[]) => {
    for (const child of el.children) {
      if (child.type === 'text') {
        const value = child.value

        leaves.push({
          start: offset,
          end: offset + value.length,
          value,
          style: coveringStyle(ancestors),
          inComment: ancestors.some((node) => node !== line && elementIsComment(node)),
        })

        offset += value.length
      } else if (child.type === 'element') {
        walk(child, [...ancestors, child])
      }
    }
  }

  walk(line, [line])

  return { text: leaves.map((leaf) => leaf.value).join(''), leaves }
}

function locateToken(line: string, token: string): TextRange[] {
  if (!token) return []

  const found: TextRange[] = []

  if (isWordLike(token)) {
    const header = isHeaderLike(token)

    const re = new RegExp(`\\b${escapeRegExp(token)}\\b`, 'g')

    for (const match of line.matchAll(re)) {
      const start = match.index ?? 0

      const end = start + token.length

      if (header && !headerBoundariesOk(line, start, end)) continue

      if (!header && ((start > 0 && line[start - 1] === '-') || (end < line.length && line[end] === '-'))) {
        continue
      }

      found.push({ start, end })
    }

    return found
  }

  const flag = isFlagToken(token)

  let from = 0

  while (from <= line.length - token.length) {
    const start = line.indexOf(token, from)

    if (start === -1) break

    const end = start + token.length

    from = start + 1

    if (flag && !flagBoundariesOk(line, start, end)) continue

    if (flag && insideLongBase64Run(line, start, end)) continue

    found.push({ start, end })
  }

  return found
}

function rangeIsComment(leaves: Leaf[], range: TextRange): boolean {
  const covering = leaves.filter((leaf) => overlaps(leaf, range))

  return covering.length > 0 && covering.every((leaf) => leaf.inComment)
}

function buildCandidates(codeLang: string, extraTips: Record<string, string> | undefined): Candidate[] {
  const candidates: Candidate[] = []

  for (const entry of entriesMatching(codeLang)) {
    for (const token of entry.match?.tokens ?? []) {
      if (token) candidates.push({ token, entry, fromExtra: false })
    }
  }

  if (extraTips) {
    for (const [token, id] of Object.entries(extraTips)) {
      if (!token) continue

      const entry = getEntry(id)

      if (!entry) continue

      candidates.push({ token, entry, fromExtra: true })
    }
  }

  candidates.sort((a, b) => b.token.length - a.token.length)

  return candidates
}

function styledText(value: string, style: string): Element {
  const properties: Properties = {}

  if (style) properties.style = style

  return {
    type: 'element',
    tagName: 'span',
    properties,
    children: [{ type: 'text', value } satisfies Text],
  }
}

function styledSlice(leaves: Leaf[], range: TextRange): ElementContent[] {
  const children: ElementContent[] = []

  for (const leaf of leaves) {
    const start = Math.max(range.start, leaf.start)

    const end = Math.min(range.end, leaf.end)

    if (start >= end) continue

    children.push(
      styledText(leaf.value.slice(start - leaf.start, end - leaf.start), leaf.style),
    )
  }

  return children
}

function filledChildren(children: ElementContent[]): ElementContent[] {
  if (children.length > 0) return children

  return [{ type: 'text', value: '' }]
}

function jwtTipProperties(wrap: JwtWrap): Properties {
  const properties: Properties = {
    class: 'tip tip--syntax',
    'data-tip-term': wrap.term,
    'data-action': tooltipActions,
    role: 'button',
    tabindex: '0',
    'aria-expanded': 'false',
  }

  if (wrap.decoded) properties['data-tip-decode'] = wrap.decoded

  if (wrap.short) properties['data-tip-short'] = wrap.short

  return properties
}

function jwtTip(wrap: JwtWrap, leaves: Leaf[]): Element {
  return {
    type: 'element',
    tagName: 'span',
    properties: jwtTipProperties(wrap),
    children: filledChildren(styledSlice(leaves, wrap)),
  }
}

function tipButton(entry: GlossaryEntry, leaves: Leaf[], range: TextRange): Element {
  return {
    type: 'element',
    tagName: 'button',
    properties: {
      type: 'button',
      class: `tip tip--${entry.kind}`,
      'data-tip-id': entry.id,
      'data-action': tooltipActions,
      'aria-expanded': 'false',
    },
    children: filledChildren(styledSlice(leaves, range)),
  }
}

function applyWraps(line: Element, leaves: Leaf[], matches: LineWrap[]): void {
  const out: ElementContent[] = []

  const lineEnd = leaves.at(-1)?.end ?? 0

  let pos = 0

  const emitPlain = (from: number, to: number) => {
    if (from >= to) return

    for (const leaf of leaves) {
      const start = Math.max(from, leaf.start)

      const end = Math.min(to, leaf.end)

      if (start >= end) continue

      out.push(styledText(leaf.value.slice(start - leaf.start, end - leaf.start), leaf.style))
    }
  }

  for (const match of matches) {
    emitPlain(pos, match.start)

    if (isJwtWrap(match)) {
      out.push(jwtTip(match, leaves))
    } else {
      out.push(tipButton(match.entry, leaves, match))
    }

    pos = match.end
  }

  emitPlain(pos, lineEnd)

  line.children = out
}

/**
 * Wrap glossary tokens in highlighted code with `<button class="tip">`.
 * JWT header/payload segments get the same popover with decoded JSON.
 */
function jwtTermLabel(kind: 'header' | 'payload' | 'signature'): string {
  if (kind === 'header') return jwtTipTerms.header

  if (kind === 'payload') return jwtTipTerms.payload

  return jwtTipTerms.signature
}

export function tooltipTransformer(opts?: TransformerOpts): ShikiTransformer {
  return {
    name: 'curlswigger-tooltips',
    line(hast: Element) {
      const { text, leaves } = collectLeaves(hast)

      if (!text) return

      const holes = placeholderRanges(text)

      const occupied: TextRange[] = []

      const wraps: LineWrap[] = []

      for (const tip of findJwtTips(text)) {
        const range = { start: tip.start, end: tip.end }

        if (holes.some((hole) => overlaps(hole, range))) continue

        occupied.push(range)

        if (tip.kind === 'signature') {
          wraps.push({
            start: tip.start,
            end: tip.end,
            term: jwtTipTerms.signature,
            short: jwtTipTerms.signatureHint,
          })
        } else if (tip.decoded) {
          wraps.push({
            start: tip.start,
            end: tip.end,
            term: jwtTermLabel(tip.kind),
            decoded: tip.decoded,
          })
        }
      }

      const codeLang = resolveCodeLang(opts?.codeLang, this.options.lang)

      const candidates = buildCandidates(codeLang, opts?.extraTips)

      const found: GlossaryWrap[] = []

      for (const candidate of candidates) {
        for (const range of locateToken(text, candidate.token)) {
          if (occupied.some((prev) => overlaps(prev, range))) continue

          if (holes.some((hole) => overlaps(hole, range))) continue

          if (rangeIsComment(leaves, range)) continue

          occupied.push(range)

          found.push({
            start: range.start,
            end: range.end,
            text: text.slice(range.start, range.end),
            entry: candidate.entry,
            fromExtra: candidate.fromExtra,
          })
        }
      }

      const seen = seenIds(this.meta)

      for (const match of found) {
        if (!match.fromExtra && isFirstOnly(match.entry) && seen.has(match.entry.id)) {
          continue
        }

        wraps.push(match)

        opts?.collector?.add(match.entry.id)

        if (!match.fromExtra && isFirstOnly(match.entry)) {
          seen.add(match.entry.id)
        }
      }

      if (wraps.length === 0) return

      wraps.sort((a, b) => a.start - b.start)

      applyWraps(hast, leaves, wraps)
    },
  }
}
