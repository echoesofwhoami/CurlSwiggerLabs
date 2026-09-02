import { getShikiTheme, type ShikiThemeId, type ShikiVarMap } from '../styles/shiki-themes';

export const STORAGE_ACTIVE = 'csl-theme-active';
export const STORAGE_SAVED = 'csl-theme-saved';
export const STORAGE_VARS = 'csl-theme-vars';

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

/** Quiz success/error foreground colors derived from surface luminance. */
export function quizVarsFromConfig(config: ThemeConfig): {
  '--success-fg': string;
  '--success-border': string;
  '--error-fg': string;
} {
  const hex = config.surfaceElevated.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const light = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
  return {
    '--success-fg': light ? '#15803d' : '#86efac',
    '--success-border': '#22c55e',
    '--error-fg': light ? config.accent : config.accentSoft,
  };
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

export const FONT_OPTIONS: FontOption[] = [
  { id: 'quicksand', label: 'Quicksand', family: "'Quicksand', sans-serif", google: null },
  {
    id: 'source-sans-3',
    label: 'Source Sans 3',
    family: "'Source Sans 3', sans-serif",
    google: 'Source+Sans+3:wght@300..700',
  },
  {
    id: 'ibm-plex-sans',
    label: 'IBM Plex Sans',
    family: "'IBM Plex Sans', sans-serif",
    google: 'IBM+Plex+Sans:wght@300;400;500;600;700',
  },
  {
    id: 'inter',
    label: 'Inter',
    family: "'Inter', sans-serif",
    google: 'Inter:wght@300..700',
  },
  {
    id: 'dm-sans',
    label: 'DM Sans',
    family: "'DM Sans', sans-serif",
    google: 'DM+Sans:opsz,wght@9..40,300..700',
  },
  {
    id: 'nunito-sans',
    label: 'Nunito Sans',
    family: "'Nunito Sans', sans-serif",
    google: 'Nunito+Sans:opsz,wght@6..12,300..700',
  },
  {
    id: 'space-grotesk',
    label: 'Space Grotesk',
    family: "'Space Grotesk', sans-serif",
    google: 'Space+Grotesk:wght@300..700',
  },
  {
    id: 'outfit',
    label: 'Outfit',
    family: "'Outfit', sans-serif",
    google: 'Outfit:wght@300..700',
  },
  {
    id: 'jetbrains-mono',
    label: 'JetBrains Mono',
    family: "'JetBrains Mono', monospace",
    google: 'JetBrains+Mono:wght@300..700',
  },
  {
    id: 'fira-code',
    label: 'Fira Code',
    family: "'Fira Code', monospace",
    google: 'Fira+Code:wght@300..700',
  },
  {
    id: 'source-code-pro',
    label: 'Source Code Pro',
    family: "'Source Code Pro', monospace",
    google: 'Source+Code+Pro:wght@300..700',
  },
  {
    id: 'literata',
    label: 'Literata',
    family: "'Literata', serif",
    google: 'Literata:opsz,wght@7..72,300..700',
  },
  {
    id: 'source-serif-4',
    label: 'Source Serif 4',
    family: "'Source Serif 4', serif",
    google: 'Source+Serif+4:opsz,wght@8..60,300..700',
  },
  {
    id: 'libre-baskerville',
    label: 'Libre Baskerville',
    family: "'Libre Baskerville', serif",
    google: 'Libre+Baskerville:wght@400;700',
  },
  {
    id: 'merriweather',
    label: 'Merriweather',
    family: "'Merriweather', serif",
    google: 'Merriweather:opsz,wght@18..144,300..700',
  },
];

export const DEFAULT_PRESET_ID = 'echoes';

export const DEFAULT_CONFIG: ThemeConfig = {
  pageBg: '#0b0d13',
  surface: '#0A0F1B',
  surfaceElevated: '#1e293b',
  border: '#334155',
  borderMuted: '#475569',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  heading: '#f8fafc',
  accent: '#dc2626',
  accentHover: '#ef4444',
  accentSoft: '#f87171',
  fontSans: "'Quicksand', sans-serif",
  fontSizeBase: 18,
  lineHeight: 1.6,
  contentMaxWidth: 1180,
  contentGap: 1.75,
  radius: 6,
  codeBg: '#0A0A0A',
  codeInlineBg: '#1e293b',
  codeInlineFg: '#dc2626',
  codeFontSize: 16,
  codePlaceholder: '#D70000',
  shikiTheme: 'echoes',
};

export const PRESETS: ThemePreset[] = [
  { id: DEFAULT_PRESET_ID, label: 'Echoes (default)', config: { ...DEFAULT_CONFIG } },
  {
    id: 'echoes-light',
    label: 'Echoes Light',
    config: {
      ...DEFAULT_CONFIG,
      pageBg: '#f7f4ef',
      surface: '#ffffff',
      surfaceElevated: '#efeae2',
      border: '#000000',
      borderMuted: '#000000',
      text: '#2c2925',
      textMuted: '#5c564e',
      heading: '#1a1814',
      accent: '#b91c1c',
      accentHover: '#991b1b',
      accentSoft: '#c45c5c',
      fontSans: "'Quicksand', sans-serif",
      fontSizeBase: 18,
      lineHeight: 1.7,
      contentMaxWidth: 1180,
      contentGap: 1.75,
      radius: 0,
      codeBg: '#ffffff',
      codeInlineBg: '#efeae2',
      codeInlineFg: '#b91c1c',
      codeFontSize: 16,
      codePlaceholder: '#D70000',
      shikiTheme: 'echoes-light',
    },
  },
  {
    id: 'soft-dark',
    label: 'Soft Dark',
    config: {
      ...DEFAULT_CONFIG,
      pageBg: '#12141c',
      surface: '#1a1d27',
      surfaceElevated: '#252836',
      border: '#3a3f4f',
      borderMuted: '#4a5060',
      text: '#d4d8e0',
      textMuted: '#9aa3b2',
      heading: '#f0f2f5',
      accent: '#e85d5d',
      accentHover: '#f07575',
      accentSoft: '#f0a0a0',
      codeBg: '#161820',
      codeInlineBg: '#252836',
      codeInlineFg: '#e85d5d',
      codePlaceholder: '#e85d5d',
      shikiTheme: 'nord',
      fontSans: "'Source Sans 3', sans-serif",
      fontSizeBase: 18,
      lineHeight: 1.65,
    },
  },
  {
    id: 'high-contrast',
    label: 'High Contrast',
    config: {
      ...DEFAULT_CONFIG,
      pageBg: '#000000',
      surface: '#0a0a0a',
      surfaceElevated: '#1a1a1a',
      border: '#ffffff',
      borderMuted: '#cccccc',
      text: '#ffffff',
      textMuted: '#dddddd',
      heading: '#ffffff',
      accent: '#ff0000',
      accentHover: '#ff4444',
      accentSoft: '#ff6666',
      codeBg: '#000000',
      codeInlineBg: '#1a1a1a',
      codeInlineFg: '#ff0000',
      codePlaceholder: '#ff0000',
      shikiTheme: 'github-dark',
      fontSizeBase: 19,
      lineHeight: 1.55,
      radius: 0,
    },
  },
  {
    id: 'light-paper',
    label: 'Light Paper',
    config: {
      ...DEFAULT_CONFIG,
      pageBg: '#f7f4ef',
      surface: '#ffffff',
      surfaceElevated: '#efeae2',
      border: '#d4cdc2',
      borderMuted: '#c4bbb0',
      text: '#2c2925',
      textMuted: '#5c564e',
      heading: '#1a1814',
      accent: '#b91c1c',
      accentHover: '#991b1b',
      accentSoft: '#c45c5c',
      codeBg: '#ffffff',
      codeInlineBg: '#efeae2',
      codeInlineFg: '#b91c1c',
      codePlaceholder: '#b91c1c',
      shikiTheme: 'github-light',
      fontSans: "'Literata', serif",
      fontSizeBase: 18,
      lineHeight: 1.7,
      radius: 4,
    },
  },
  {
    id: 'tokyo-ink',
    label: 'Tokyo Ink',
    config: {
      ...DEFAULT_CONFIG,
      pageBg: '#16161e',
      surface: '#1a1b26',
      surfaceElevated: '#24283b',
      border: '#3b4261',
      borderMuted: '#565f89',
      text: '#a9b1d6',
      textMuted: '#787c99',
      heading: '#c0caf5',
      accent: '#7aa2f7',
      accentHover: '#89b4fa',
      accentSoft: '#7dcfff',
      codeBg: '#1a1b26',
      codeInlineBg: '#24283b',
      codeInlineFg: '#7aa2f7',
      codePlaceholder: '#f7768e',
      shikiTheme: 'tokyo-night',
      fontSans: "'IBM Plex Sans', sans-serif",
      fontSizeBase: 17,
      lineHeight: 1.65,
      radius: 8,
    },
  },
  {
    id: 'mocha-lounge',
    label: 'Mocha Lounge',
    config: {
      ...DEFAULT_CONFIG,
      pageBg: '#181825',
      surface: '#1e1e2e',
      surfaceElevated: '#313244',
      border: '#45475a',
      borderMuted: '#585b70',
      text: '#cdd6f4',
      textMuted: '#a6adc8',
      heading: '#f5e0dc',
      accent: '#f38ba8',
      accentHover: '#eba0ac',
      accentSoft: '#f5c2e7',
      codeBg: '#11111b',
      codeInlineBg: '#313244',
      codeInlineFg: '#f38ba8',
      codePlaceholder: '#f38ba8',
      shikiTheme: 'catppuccin-mocha',
      fontSans: "'Nunito Sans', sans-serif",
      fontSizeBase: 18,
      lineHeight: 1.7,
      radius: 10,
      contentGap: 1.9,
    },
  },
  {
    id: 'gruvbox-campfire',
    label: 'Gruvbox Campfire',
    config: {
      ...DEFAULT_CONFIG,
      pageBg: '#1d2021',
      surface: '#282828',
      surfaceElevated: '#3c3836',
      border: '#504945',
      borderMuted: '#665c54',
      text: '#ebdbb2',
      textMuted: '#a89984',
      heading: '#fbf1c7',
      accent: '#fb4934',
      accentHover: '#fe8019',
      accentSoft: '#fabd2f',
      codeBg: '#1d2021',
      codeInlineBg: '#3c3836',
      codeInlineFg: '#fb4934',
      codePlaceholder: '#fb4934',
      shikiTheme: 'gruvbox-dark-medium',
      fontSans: "'Source Serif 4', serif",
      fontSizeBase: 18,
      lineHeight: 1.65,
      radius: 2,
    },
  },
  {
    id: 'solar-terminal',
    label: 'Solar Terminal',
    config: {
      ...DEFAULT_CONFIG,
      pageBg: '#002b36',
      surface: '#073642',
      surfaceElevated: '#094352',
      border: '#586e75',
      borderMuted: '#657b83',
      text: '#93a1a1',
      textMuted: '#839496',
      heading: '#eee8d5',
      accent: '#cb4b16',
      accentHover: '#dc322f',
      accentSoft: '#b58900',
      codeBg: '#002b36',
      codeInlineBg: '#073642',
      codeInlineFg: '#2aa198',
      codePlaceholder: '#dc322f',
      shikiTheme: 'solarized-dark',
      fontSans: "'Source Code Pro', monospace",
      fontSizeBase: 16,
      lineHeight: 1.55,
      codeFontSize: 15,
      radius: 0,
      contentMaxWidth: 1000,
    },
  },
  {
    id: 'rose-garden',
    label: 'Rose Garden',
    config: {
      ...DEFAULT_CONFIG,
      pageBg: '#faf4ed',
      surface: '#fffaf3',
      surfaceElevated: '#f2e9e1',
      border: '#dfdad9',
      borderMuted: '#cecacd',
      text: '#575279',
      textMuted: '#797593',
      heading: '#575279',
      accent: '#b4637a',
      accentHover: '#d7827e',
      accentSoft: '#907aa9',
      codeBg: '#faf4ed',
      codeInlineBg: '#f2e9e1',
      codeInlineFg: '#b4637a',
      codePlaceholder: '#b4637a',
      shikiTheme: 'rose-pine-dawn',
      fontSans: "'Merriweather', serif",
      fontSizeBase: 18,
      lineHeight: 1.75,
      radius: 12,
      contentGap: 2,
    },
  },
  {
    id: 'synth-neon',
    label: 'Synth Neon',
    config: {
      ...DEFAULT_CONFIG,
      pageBg: '#1a1625',
      surface: '#241b2f',
      surfaceElevated: '#2a2139',
      border: '#495495',
      borderMuted: '#848bbd',
      text: '#f9f5ff',
      textMuted: '#b6b1c9',
      heading: '#ffffff',
      accent: '#ff7edb',
      accentHover: '#36f9f6',
      accentSoft: '#fede5d',
      codeBg: '#262335',
      codeInlineBg: '#2a2139',
      codeInlineFg: '#ff7edb',
      codePlaceholder: '#f97e72',
      shikiTheme: 'synthwave-84',
      fontSans: "'Space Grotesk', sans-serif",
      fontSizeBase: 17,
      lineHeight: 1.6,
      radius: 8,
    },
  },
  {
    id: 'forest-read',
    label: 'Forest Read',
    config: {
      ...DEFAULT_CONFIG,
      pageBg: '#232a2e',
      surface: '#2d353b',
      surfaceElevated: '#343f44',
      border: '#4f585e',
      borderMuted: '#7a8478',
      text: '#d3c6aa',
      textMuted: '#a6b0a0',
      heading: '#e4e1cd',
      accent: '#a7c080',
      accentHover: '#83c092',
      accentSoft: '#dbbc7f',
      codeBg: '#1e2326',
      codeInlineBg: '#343f44',
      codeInlineFg: '#a7c080',
      codePlaceholder: '#e67e80',
      shikiTheme: 'everforest-dark',
      fontSans: "'Outfit', sans-serif",
      fontSizeBase: 18,
      lineHeight: 1.7,
      radius: 6,
      contentMaxWidth: 1100,
    },
  },
  {
    id: 'clean-docs',
    label: 'Clean Docs',
    config: {
      ...DEFAULT_CONFIG,
      pageBg: '#ffffff',
      surface: '#f6f8fa',
      surfaceElevated: '#eef1f4',
      border: '#d0d7de',
      borderMuted: '#afb8c1',
      text: '#1f2328',
      textMuted: '#656d76',
      heading: '#1f2328',
      accent: '#0969da',
      accentHover: '#0550ae',
      accentSoft: '#218bff',
      codeBg: '#f6f8fa',
      codeInlineBg: '#eef1f4',
      codeInlineFg: '#cf222e',
      codePlaceholder: '#cf222e',
      shikiTheme: 'one-light',
      fontSans: "'Inter', sans-serif",
      fontSizeBase: 17,
      lineHeight: 1.65,
      radius: 6,
      contentMaxWidth: 920,
      contentGap: 1.5,
    },
  },
];
const FONT_LINK_ID = 'csl-theme-font';

function fontOptionForFamily(family: string): FontOption | undefined {
  return FONT_OPTIONS.find((f) => f.family === family);
}

export function configToCssVars(config: ThemeConfig): ShikiVarMap {
  const shiki = getShikiTheme(config.shikiTheme).vars;
  return {
    '--page-bg': config.pageBg,
    '--surface': config.surface,
    '--surface-elevated': config.surfaceElevated,
    '--border': config.border,
    '--border-muted': config.borderMuted,
    '--text': config.text,
    '--text-muted': config.textMuted,
    '--heading': config.heading,
    '--accent': config.accent,
    '--accent-hover': config.accentHover,
    '--accent-soft': config.accentSoft,
    '--font-sans': config.fontSans,
    '--font-size-base': `${config.fontSizeBase}px`,
    '--line-height': String(config.lineHeight),
    '--content-max-width': `${config.contentMaxWidth}px`,
    '--content-gap': `${config.contentGap}rem`,
    '--radius': `${config.radius}px`,
    '--code-bg': config.codeBg,
    '--code-inline-bg': config.codeInlineBg,
    '--code-inline-fg': config.codeInlineFg,
    '--code-font-size': `${config.codeFontSize}px`,
    '--code-placeholder': config.codePlaceholder,
    ...quizVarsFromConfig(config),
    ...shiki,
    // Code blocks use --shiki-background inline; keep it tied to the code-bg control.
    '--shiki-background': config.codeBg,
  };
}

export function applyCssVars(vars: ShikiVarMap, root: HTMLElement = document.documentElement): void {
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

export function clearCssVars(root: HTMLElement = document.documentElement): void {
  for (const key of Object.keys(configToCssVars(DEFAULT_CONFIG))) {
    root.style.removeProperty(key);
  }
}

function normalizeHexColor(value: string): string {
  const v = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`.toLowerCase();
  }
  return v;
}

const COLOR_KEYS: (keyof ThemeConfig)[] = [
  'pageBg',
  'surface',
  'surfaceElevated',
  'border',
  'borderMuted',
  'text',
  'textMuted',
  'heading',
  'accent',
  'accentHover',
  'accentSoft',
  'codeBg',
  'codeInlineBg',
  'codeInlineFg',
  'codePlaceholder',
];

function normalizeConfig(config: Partial<ThemeConfig>): ThemeConfig {
  const merged = { ...DEFAULT_CONFIG, ...config };
  for (const key of COLOR_KEYS) {
    merged[key] = normalizeHexColor(String(merged[key])) as never;
  }
  merged.shikiTheme = getShikiTheme(merged.shikiTheme).id;
  return merged;
}

export function configsMatch(a: ThemeConfig, b: ThemeConfig): boolean {
  const left = normalizeConfig(a);
  const right = normalizeConfig(b);
  return (Object.keys(DEFAULT_CONFIG) as (keyof ThemeConfig)[]).every((key) => left[key] === right[key]);
}

export function matchPresetId(config: ThemeConfig): string | '' {
  const preset = PRESETS.find((p) => configsMatch(p.config, config));
  if (preset) return preset.id;
  if (configsMatch(config, DEFAULT_CONFIG)) return DEFAULT_PRESET_ID;
  return '';
}

export function ensureFontLoaded(family: string): void {
  const option = fontOptionForFamily(family);
  if (!option?.google) return;

  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  const href = `https://fonts.googleapis.com/css2?family=${option.google}&display=swap`;
  if (link) {
    if (link.href !== href) link.href = href;
    return;
  }
  link = document.createElement('link');
  link.id = FONT_LINK_ID;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

export function apply(config: ThemeConfig, options: { persist?: boolean } = {}): ThemeConfig {
  const merged = normalizeConfig(config);
  const vars = configToCssVars(merged);
  applyCssVars(vars);
  ensureFontLoaded(merged.fontSans);

  if (options.persist !== false) {
    try {
      localStorage.setItem(STORAGE_ACTIVE, JSON.stringify(merged));
      localStorage.setItem(STORAGE_VARS, JSON.stringify(vars));
    } catch {
      /* private mode / quota */
    }
  }
  return merged;
}

export function getActive(): ThemeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE);
    if (!raw) return normalizeConfig({});
    return normalizeConfig(JSON.parse(raw) as Partial<ThemeConfig>);
  } catch {
    return normalizeConfig({});
  }
}

export function listPresets(): ThemePreset[] {
  return PRESETS;
}

export function getPreset(id: string): ThemePreset | undefined {
  return PRESETS.find((p) => p.id === id);
}

export function listSaved(): Record<string, ThemeConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_SAVED);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ThemeConfig>;
  } catch {
    return {};
  }
}

export function save(name: string, config: ThemeConfig): void {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Name is required');
  const saved = listSaved();
  saved[trimmed] = normalizeConfig(config);
  localStorage.setItem(STORAGE_SAVED, JSON.stringify(saved));
}

export function deleteSaved(name: string): void {
  const saved = listSaved();
  delete saved[name];
  localStorage.setItem(STORAGE_SAVED, JSON.stringify(saved));
}

export function resetToDefault(): ThemeConfig {
  try {
    localStorage.removeItem(STORAGE_ACTIVE);
    localStorage.removeItem(STORAGE_VARS);
  } catch {
    /* ignore */
  }
  clearCssVars();
  return apply(normalizeConfig({}), { persist: false });
}
