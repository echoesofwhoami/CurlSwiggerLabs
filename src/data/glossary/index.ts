import { CONCEPTS } from './concepts';
import { BASH_SYNTAX } from './syntax/bash';
import { CURL_SYNTAX } from './syntax/curl';
import { HTTP_SYNTAX } from './syntax/http';
import { JAVASCRIPT_SYNTAX } from './syntax/javascript';
import { NODE_SYNTAX } from './syntax/node';
import { PYTHON_SYNTAX } from './syntax/python';
import type { CodeLang, GlossaryEntry, GlossaryLang } from './types';

export * from './types';

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
};

function assertUniqueIds(entries: GlossaryEntry[]): void {
  const seen = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.id)) {
      throw new Error(`Duplicate glossary id: ${entry.id}`);
    }
    seen.add(entry.id);
  }
}

function mapCodeLang(codeLang: string): CodeLang | undefined {
  return LANG_ALIASES[codeLang.toLowerCase()];
}

export const GLOSSARY: GlossaryEntry[] = [
  ...CURL_SYNTAX,
  ...BASH_SYNTAX,
  ...JAVASCRIPT_SYNTAX,
  ...NODE_SYNTAX,
  ...PYTHON_SYNTAX,
  ...HTTP_SYNTAX,
  ...CONCEPTS,
];

assertUniqueIds(GLOSSARY);

const BY_ID = new Map<string, GlossaryEntry>(
  GLOSSARY.map((entry) => [entry.id, entry]),
);

export function getEntry(id: string): GlossaryEntry | undefined {
  return BY_ID.get(id);
}

export function entriesMatching(codeLang: string): GlossaryEntry[] {
  const mapped = mapCodeLang(codeLang);
  if (mapped === undefined) {
    return [];
  }
  return GLOSSARY.filter((entry) => entry.match?.langs.includes(mapped));
}

export function localizedText(
  entry: GlossaryEntry,
  lang: GlossaryLang,
): { term: string; short: string } {
  const term = lang === 'es' && entry.term.es ? entry.term.es : entry.term.en;
  const short = lang === 'es' && entry.short.es ? entry.short.es : entry.short.en;
  return { term, short };
}

export function isFirstOnly(entry: GlossaryEntry): boolean {
  return entry.match?.firstOnly ?? entry.kind === 'syntax';
}
