export type DiffMark = 'eq' | 'add' | 'del'

export interface DiffToken {
  value: string;
  type: DiffMark;
}

export interface DiffRow {
  kind: 'eq' | 'add' | 'del' | 'change';
  left: DiffToken[];
  right: DiffToken[];
  /** Single stream for the mobile unified view (eq + del + add in order). */
  unified: DiffToken[];
}

export interface TextPart {
  text: string;
  placeholder: boolean;
}

export interface JwtParts {
  header: string;
  payload: string;
  signature: string;
  headerJson: string | undefined;
  payloadJson: string | undefined;
}

export interface JwtTipRange {
  start: number;
  end: number;
  kind: 'header' | 'payload' | 'signature';
  decoded: string | undefined;
}

export interface RequestDiffLoadInput {
  left: string;
  right: string;
  leftLabel?: string;
  rightLabel?: string;
  tipAction: string;
  slugify: (value: string) => string;
}

export interface JwtChangeFlags {
  header: boolean;
  payload: boolean;
  signature: boolean;
}

export interface DiffModes {
  jwtMode: boolean;
  jsonMode: boolean;
  httpMode: boolean;
}

export interface DiffPartView {
  text: string;
  type: DiffMark;
  placeholder: boolean;
}

export interface DiffLineView {
  kind: DiffRow['kind'];
  parts: DiffPartView[];
}

export interface JwtSegmentView {
  text: string;
  mark: DiffMark;
  dot: boolean;
  hoverable: boolean;
  term?: string;
  decode?: string;
  short?: string;
  role?: 'button';
  tabindex?: '0';
  expanded?: 'false';
  action?: string;
}

export interface RequestDiffSideView {
  id: 'left' | 'right';
  title: string;
  active: boolean;
  labelClass: string;
  swatchClass: string;
  selected: 'true' | 'false';
  hidden: true | undefined;
  segments: JwtSegmentView[];
  lines: DiffLineView[];
}

export interface RequestDiffView {
  leftRaw: string;
  rightRaw: string;
  jsonMode: boolean;
  httpMode: boolean;
  jwtMode: boolean;
  diffId: string;
  activePanel: string;
  sides: RequestDiffSideView[];
}

export interface LoadedDiff {
  left: string;
  right: string;
}

export interface SideBuild {
  id: 'left' | 'right';
  label: string | undefined;
  fallback: string;
  active: boolean;
  jwt: JwtParts | undefined;
  rows: DiffRow[];
  jwtMode: boolean;
  changes: JwtChangeFlags;
  tipAction: string;
}
