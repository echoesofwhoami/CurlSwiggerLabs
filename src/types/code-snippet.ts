import type { CodeLanguage } from 'astro'
import type curlplain from '../themes/curlplain.tmLanguage.json'

export interface CodeSnippetLoadInput {
  file: string;
  body?: string;
  lang?: CodeLanguage;
  noRawHttp?: boolean;
}

export interface ResolvedCodeSnippetInput {
  file: string;
  body?: string;
  lang?: CodeLanguage;
  noRawHttp: boolean;
}

export interface CodeSnippetView {
  code: string;
  lang: CodeLanguage | typeof curlplain;
  matchLang: string;
  bodyCode: string;
  hasBody: boolean;
  httpRaw: string;
  hasHttp: boolean;
  id: string;
}

export interface LoadedSnippet {
  code: string;
  bodyCode: string | undefined;
  shellEnv: Record<string, string>;
}
