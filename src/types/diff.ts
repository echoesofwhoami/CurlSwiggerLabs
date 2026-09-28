export type DiffMark = 'eq' | 'add' | 'del';

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
  headerJson: string | null;
  payloadJson: string | null;
}

export interface JwtTipRange {
  start: number;
  end: number;
  kind: 'header' | 'payload' | 'signature';
  decoded: string | null;
}
