import type { GlossaryEntry } from './glossary';

export interface TransformerOpts {
  codeLang?: string;
  extraTips?: Record<string, string>;
  collector?: Set<string>;
}

export interface Candidate {
  token: string;
  entry: GlossaryEntry;
  fromExtra: boolean;
}

export interface Leaf {
  start: number;
  end: number;
  value: string;
  style: string;
  inComment: boolean;
}

export interface TextRange {
  start: number;
  end: number;
}

export interface GlossaryWrap {
  start: number;
  end: number;
  text: string;
  entry: GlossaryEntry;
  fromExtra: boolean;
}

export interface JwtWrap {
  start: number;
  end: number;
  term: string;
  decoded?: string;
  short?: string;
}

export type LineWrap = GlossaryWrap | JwtWrap;
