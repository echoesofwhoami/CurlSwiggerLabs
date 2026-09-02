export type TipKind = 'syntax' | 'concept';
export type GlossaryLang = 'en' | 'es';
export type CodeLang = 'bash' | 'javascript' | 'python' | 'http' | 'html' | 'php' | 'json';

export interface GlossaryRef {
  title: string;
  url: string;
}

export interface Localized {
  en: string;
  es?: string;
}

export interface GlossaryMatch {
  langs: CodeLang[];
  tokens: string[];
  /**
   * If true, annotate only the first occurrence per code block.
   * Default when omitted: true for kind==='syntax', false for kind==='concept'.
   */
  firstOnly?: boolean;
}

export interface GlossaryEntry {
  id: string;
  kind: TipKind;
  match?: GlossaryMatch;
  term: Localized;
  short: Localized; // 1-2 sentences, teaching voice
  partial?: string; // CollapsiblePartial id when one exists
  refs?: GlossaryRef[]; // concept only; syntax may omit or keep unofficial extra links out of post refs
}
