export type ShikiVarMap = Record<string, string>

export interface ShikiThemePack {
  id: string;
  label: string;
  vars: ShikiVarMap;
}

export type ShikiThemeId = string

export interface ThemeConfig {
  pageBg: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderMuted: string;
  text: string;
  textMuted: string;
  heading: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  fontSans: string;
  fontSizeBase: number;
  lineHeight: number;
  contentMaxWidth: number;
  contentGap: number;
  radius: number;
  codeBg: string;
  codeInlineBg: string;
  codeInlineFg: string;
  codeFontSize: number;
  codePlaceholder: string;
  shikiTheme: ShikiThemeId;
}

export interface FontOption {
  id: string;
  label: string;
  family: string;
  /** Google Fonts family query segment, or null for system / already loaded */
  google: string | null;
}

export interface ThemePreset {
  id: string;
  label: string;
  config: ThemeConfig;
}
