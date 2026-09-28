import { CONCEPTS } from './concepts'
import { BASH_SYNTAX } from './syntax/bash'
import { CURL_SYNTAX } from './syntax/curl'
import { HTTP_SYNTAX } from './syntax/http'
import { JAVASCRIPT_SYNTAX } from './syntax/javascript'
import { NODE_SYNTAX } from './syntax/node'
import { PYTHON_SYNTAX } from './syntax/python'
import type { ClientTip, CodeLang, ConceptReference, GlossaryEntry, TermView } from '../../types/glossary'

export type {
  TipKind,
  CodeLang,
  GlossaryRef,
  Localized,
  GlossaryMatch,
  GlossaryEntry,
} from '../../types/glossary'

const LANG_ALIASES: Record<string, CodeLang> = {
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  curlplain: 'bash',
  js: 'javascript',
  javascript: 'javascript',
  py: 'python',
  python: 'python',
  http: 'http',
  html: 'html',
  php: 'php',
  json: 'json',
}

function assertUniqueIds(entries: GlossaryEntry[]): void {
  const seen = new Set<string>()

  for (const entry of entries) {
    if (seen.has(entry.id)) {
      throw new Error(`Duplicate glossary id: ${entry.id}`)
    }

    seen.add(entry.id)
  }
}

function mapCodeLang(codeLang: string): CodeLang | undefined {
  return LANG_ALIASES[codeLang.toLowerCase()]
}

export const GLOSSARY: GlossaryEntry[] = [
  ...CURL_SYNTAX,
  ...BASH_SYNTAX,
  ...JAVASCRIPT_SYNTAX,
  ...NODE_SYNTAX,
  ...PYTHON_SYNTAX,
  ...HTTP_SYNTAX,
  ...CONCEPTS,
]

assertUniqueIds(GLOSSARY)

const BY_ID = new Map<string, GlossaryEntry>(
  GLOSSARY.map((entry) => [entry.id, entry]),
)

export function getEntry(id: string): GlossaryEntry | undefined {
  return BY_ID.get(id)
}

export function entriesMatching(codeLang: string): GlossaryEntry[] {
  const mapped = mapCodeLang(codeLang)

  if (!mapped) {
    return []
  }

  return GLOSSARY.filter((entry) => entry.match?.langs.includes(mapped))
}

export function localizedText(entry: GlossaryEntry): { term: string; short: string } {
  return { term: entry.term.en, short: entry.short.en }
}

export function collectUsedTips(locals: { usedTips?: Set<string> }): Set<string> {
  const usedTips = locals.usedTips ?? new Set<string>()

  locals.usedTips = usedTips

  return usedTips
}

export function termView(id: string, locals: { usedTips?: Set<string> }): TermView {
  const entry = getEntry(id)

  const usedTips = collectUsedTips(locals)

  if (!entry) {
    console.warn(`[Term] unknown glossary id: ${id}`)

    return { entry, label: id, kindClass: 'tip--concept' }
  }

  usedTips.add(id)

  return {
    entry,
    label: localizedText(entry).term,
    kindClass: termKindClass(entry),
  }
}

function termKindClass(entry: GlossaryEntry): string {
  if (entry.kind === 'syntax') return 'tip--syntax'

  return 'tip--concept'
}

export function isFirstOnly(entry: GlossaryEntry): boolean {
  return entry.match?.firstOnly ?? entry.kind === 'syntax'
}

function uniqueConcepts(usedIds: Iterable<string>): GlossaryEntry[] {
  const concepts: GlossaryEntry[] = []

  const seen = new Set<string>()

  for (const id of usedIds) {
    const entry = getEntry(id)

    if (!entry) continue

    if (entry.kind !== 'concept') continue

    if (seen.has(entry.id)) continue

    seen.add(entry.id)

    concepts.push(entry)
  }

  return concepts
}

function toConceptReference(entry: GlossaryEntry): ConceptReference {
  const text = localizedText(entry)

  return {
    id: entry.id,
    term: text.term,
    short: text.short,
    refs: entry.refs ?? [],
  }
}

function byTerm(a: ConceptReference, b: ConceptReference): number {
  return a.term.localeCompare(b.term)
}

export function conceptReferences(usedIds: Iterable<string>): ConceptReference[] {
  const concepts = uniqueConcepts(usedIds)

  const references = concepts.map(toConceptReference)

  references.sort(byTerm)

  return references
}

function toClientTip(entry: GlossaryEntry): ClientTip {
  const text = localizedText(entry)

  const tip: ClientTip = {
    kind: entry.kind,
    term: text.term,
    short: text.short,
  }

  const refs = entry.refs

  if (refs && refs.length > 0) tip.refs = refs

  return tip
}

function clientTips(): Record<string, ClientTip> {
  const tips: Record<string, ClientTip> = {}

  for (const entry of GLOSSARY) {
    tips[entry.id] = toClientTip(entry)
  }

  return tips
}

export function clientGlossary(): string {
  const tips = clientTips()

  const json = JSON.stringify(tips)

  return json.replace(/</g, '\\u003c')
}
