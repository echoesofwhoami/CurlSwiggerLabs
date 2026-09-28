import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { CodeLanguage } from 'astro'
import curlplain from '../themes/curlplain.tmLanguage.json'
import type { ShikiTransformer } from 'shiki'
import { collectUsedTips } from '@data/glossary'
import { placeholderTransformer } from '../shiki/placeholder-transformer'
import { tooltipTransformer } from '../shiki/tooltip-transformer'
import { copyButtonTransformer } from '../shiki/copy-button-transformer'
import { curlToHttp, isBashFile } from './curl-to-http'
import type {
  CodeSnippetLoadInput,
  CodeSnippetView,
  HttpConversion,
  LoadedSnippet,
  ResolvedCodeSnippetInput,
} from '@types'
import { slugifyId } from './index'

const EXT_TO_LANG: Record<string, CodeLanguage> = {
  py: 'python',
  sh: 'bash',
  bash: 'bash',
  http: 'http',
  js: 'javascript',
  html: 'html',
  php: 'php',
  json: 'json',
  txt: 'plaintext',
}

const PLAINTEXT_ALIASES = new Set(['plaintext', 'txt', 'plain', 'text'])

const scriptsRoot = join(process.cwd(), 'src/data/scripts')

export function loadCodeSnippet(input: CodeSnippetLoadInput): CodeSnippetView {
  const resolved = resolveCodeSnippetInput(input)

  const loaded = loadSnippetSources(resolved)

  return deriveSnippet(loaded, resolved)
}

export function codeSnippetTransformers(input: {
  matchLang: string
  tips?: Record<string, string>
  locals: { usedTips?: Set<string> }
}) {
  const usedTips = collectUsedTips(input.locals)

  return {
    transformers: highlightTransformers(input.matchLang, input.tips, usedTips),
    httpTransformers: highlightTransformers('http', input.tips, usedTips),
    jsonTransformers: highlightTransformers('json', input.tips, usedTips),
  }
}

function highlightTransformers(
  codeLang: string,
  tips: Record<string, string> | undefined,
  usedTips: Set<string>,
): ShikiTransformer[] {
  return [
    placeholderTransformer,
    tooltipTransformer({ extraTips: tips, collector: usedTips, codeLang }),
    copyButtonTransformer,
  ]
}

function resolveCodeSnippetInput(input: CodeSnippetLoadInput): ResolvedCodeSnippetInput {
  return {
    file: input.file,
    body: input.body,
    lang: input.lang,
    noRawHttp: input.noRawHttp ?? false,
  }
}

function loadSnippetSources(input: ResolvedCodeSnippetInput): LoadedSnippet {
  const code = readScript(input.file)

  const bodyCode = readBody(input.body)

  const shellEnv = readShellEnv(input.file, input.noRawHttp)

  return { code, bodyCode, shellEnv }
}

function deriveSnippet(loaded: LoadedSnippet, input: ResolvedCodeSnippetInput): CodeSnippetView {
  const inferred = inferredLanguage(input.file, input.lang)

  const http = convertCurl(input.file, loaded.code, input.noRawHttp, loaded.shellEnv)

  return {
    code: loaded.code,
    lang: highlightLanguage(inferred),
    matchLang: matchLanguage(input.file, inferred),
    bodyCode: loaded.bodyCode ?? '',
    hasBody: loaded.bodyCode !== undefined,
    httpRaw: httpRawOf(http),
    hasHttp: http !== undefined,
    id: `cht-${slugifyId(input.file)}`,
  }
}

function readScript(file: string): string {
  return readFileSync(join(scriptsRoot, file), 'utf-8').replace(/\n$/, '')
}

function readBody(file: string | undefined): string | undefined {
  if (!file) return

  return prettyJson(readScript(file))
}

function prettyJson(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}

function fileExtension(file: string): string {
  const parts = file.split('.')

  if (parts.length < 2) return ''

  const ext = parts[parts.length - 1]

  if (!ext) return ''

  return ext
}

function inferredLanguage(file: string, lang: CodeLanguage | undefined): CodeLanguage {
  if (lang) return lang

  const mapped = EXT_TO_LANG[fileExtension(file)]

  if (mapped) return mapped

  return 'plaintext'
}

function isPlaintext(lang: CodeLanguage): boolean {
  return PLAINTEXT_ALIASES.has(String(lang))
}

function highlightLanguage(inferred: CodeLanguage): CodeLanguage | typeof curlplain {
  if (isPlaintext(inferred)) return curlplain

  return inferred
}

function matchLanguage(file: string, inferred: CodeLanguage): string {
  if (!isPlaintext(inferred)) return String(inferred)

  if (isBashFile(file)) return 'bash'

  return ''
}

function convertCurl(
  file: string,
  code: string,
  noRawHttp: boolean,
  env: Record<string, string>,
): HttpConversion | undefined {
  if (noRawHttp) return

  if (!isBashFile(file)) return

  return curlToHttp(code, env)
}

function httpRawOf(http: HttpConversion | undefined): string {
  if (!http) return ''

  return http.raw
}

/**
 * Shell assignments from sibling scripts in the same lab directory
 * (`BASE_LAB_URL="https://..."`) so `$VAR` expands in the Raw HTTP view.
 */
function readShellEnv(file: string, noRawHttp: boolean): Record<string, string> {
  if (noRawHttp) return {}

  if (!isBashFile(file)) return {}

  return assignmentsInLab(dirname(file))
}

function assignmentsInLab(labRelativeDir: string): Record<string, string> {
  const env: Record<string, string> = {}

  for (const entry of listDir(join(scriptsRoot, labRelativeDir))) {
    if (!isShellScript(entry)) continue

    collectAssignments(readFileSync(join(scriptsRoot, labRelativeDir, entry), 'utf-8'), env)
  }

  return env
}

function listDir(dir: string): string[] {
  try {
    return readdirSync(dir)
  } catch {
    return []
  }
}

function isShellScript(name: string): boolean {
  if (name.endsWith('.sh')) return true

  if (name.endsWith('.bash')) return true

  return false
}

function collectAssignments(source: string, env: Record<string, string>) {
  const pattern = /^([A-Za-z_][A-Za-z0-9_]*)=["']?([^"'\n]+?)["']?\s*$/gm

  for (const match of source.matchAll(pattern)) {
    const name = match[1]

    const value = match[2]

    if (!name) continue

    if (!value) continue

    env[name] = value
  }
}
