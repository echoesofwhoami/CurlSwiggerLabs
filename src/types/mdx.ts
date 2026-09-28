import type { CodeLanguage } from 'astro'

export interface CollapsiblePartialProps {
  partial: string;
  title: string;
}

export interface CodeSnippetProps {
  /** Path relative to `src/data/scripts/` */
  file: string;
  /** Optional JSON body path relative to `src/data/scripts/` */
  body?: string;
  /** Override language inferred from the file extension */
  lang?: CodeLanguage;
  /** Set to true to suppress the curl - Raw HTTP toggle even for bash scripts */
  noRawHttp?: boolean;
  /** Lab-specific overlays: exact token text -> glossary id */
  tips?: Record<string, string>;
}

export interface RequestDiffProps {
  /** Path relative to `src/data/scripts/` */
  left: string;
  /** Path relative to `src/data/scripts/` */
  right: string;
  leftLabel?: string;
  rightLabel?: string;
}

export interface TermProps {
  id: string;
  /** Optional custom visible text; default localized term */
}

export interface CompactCollapsibleCodeProps {
  /** Path relative to `src/data/scripts/` */
  file: string;
  title: string;
  codeLang?: CodeLanguage;
}

export interface CompactCollapsiblePartialProps {
  partial: string;
  title: string;
  collection?: 'partials' | 'lab-notes';
}

export interface PartialRendererProps {
  partial: string;
}

export interface ExternalLinkProps {
  text: string;
  url: string;
  class?: string;
}
