/** Curated Shiki CSS-variable packs for runtime theme switching. */

export type ShikiVarMap = Record<string, string>;

export interface ShikiThemePack {
  id: string;
  label: string;
  vars: ShikiVarMap;
}

export type ShikiThemeId = string;

function pack(
  id: string,
  label: string,
  foreground: string,
  background: string,
  constant: string,
  string: string,
  comment: string,
  keyword: string,
  parameter: string,
  fn: string,
  stringExpression = string,
  punctuation = foreground,
  link = string,
): ShikiThemePack {
  return {
    id,
    label,
    vars: {
      '--shiki-foreground': foreground,
      '--shiki-background': background,
      '--shiki-token-constant': constant,
      '--shiki-token-string': string,
      '--shiki-token-comment': comment,
      '--shiki-token-keyword': keyword,
      '--shiki-token-parameter': parameter,
      '--shiki-token-function': fn,
      '--shiki-token-string-expression': stringExpression,
      '--shiki-token-punctuation': punctuation,
      '--shiki-token-link': link,
    },
  };
}

export const SHIKI_THEMES: Record<string, ShikiThemePack> = {
  echoes: pack('echoes', 'Echoes', '#ffffff', '#000000', '#d70000', '#ff5252', '#888888', '#d70000', '#aaaaaa', '#d70000'),
  'echoes-light': pack(
    'echoes-light',
    'Echoes Light',
    '#1c1917',
    '#ffffff',
    '#b91c1c',
    '#e11d48',
    '#78716c',
    '#9f1239',
    '#57534e',
    '#d70000',
    '#e11d48',
    '#44403c',
    '#b91c1c',
  ),
  'github-dark': pack('github-dark', 'GitHub Dark', '#e6edf3', '#0d1117', '#79c0ff', '#a5d6ff', '#8b949e', '#ff7b72', '#ffa657', '#d2a8ff'),
  'github-dark-dimmed': pack('github-dark-dimmed', 'GitHub Dark Dimmed', '#adbac7', '#22272e', '#6cb6ff', '#96d0ff', '#768390', '#f47067', '#f69d50', '#dcbdfb'),
  'github-light': pack('github-light', 'GitHub Light', '#1f2328', '#ffffff', '#0550ae', '#0a3069', '#6e7781', '#cf222e', '#953800', '#8250df'),
  dracula: pack('dracula', 'Dracula', '#f8f8f2', '#282a36', '#bd93f9', '#f1fa8c', '#6272a4', '#ff79c6', '#ffb86c', '#50fa7b', '#f1fa8c', '#f8f8f2', '#8be9fd'),
  'dracula-soft': pack('dracula-soft', 'Dracula Soft', '#f6f6f4', '#282a36', '#bf9eee', '#e7ee98', '#7a88b3', '#f286c4', '#ffb86c', '#62e884'),
  nord: pack('nord', 'Nord', '#d8dee9', '#2e3440', '#b48ead', '#a3be8c', '#616e88', '#81a1c1', '#d08770', '#88c0d0', '#a3be8c', '#eceff4', '#8fbcbb'),
  'one-dark-pro': pack('one-dark-pro', 'One Dark Pro', '#abb2bf', '#282c34', '#d19a66', '#98c379', '#5c6370', '#c678dd', '#d19a66', '#61afef', '#98c379', '#abb2bf', '#56b6c2'),
  'one-light': pack('one-light', 'One Light', '#383a42', '#fafafa', '#986801', '#50a14f', '#a0a1a7', '#a626a4', '#c18401', '#4078f2'),
  monokai: pack('monokai', 'Monokai', '#f8f8f2', '#272822', '#ae81ff', '#e6db74', '#75715e', '#f92672', '#fd971f', '#a6e22e'),
  'tokyo-night': pack('tokyo-night', 'Tokyo Night', '#a9b1d6', '#1a1b26', '#ff9e64', '#9ece6a', '#565f89', '#bb9af7', '#e0af68', '#7aa2f7', '#9ece6a', '#a9b1d6', '#73daca'),
  'catppuccin-mocha': pack('catppuccin-mocha', 'Catppuccin Mocha', '#cdd6f4', '#1e1e2e', '#fab387', '#a6e3a1', '#6c7086', '#cba6f7', '#f9e2af', '#89b4fa', '#a6e3a1', '#cdd6f4', '#89dceb'),
  'catppuccin-latte': pack('catppuccin-latte', 'Catppuccin Latte', '#4c4f69', '#eff1f5', '#fe640b', '#40a02b', '#9ca0b0', '#8839ef', '#df8e1d', '#1e66f5'),
  'rose-pine': pack('rose-pine', 'Rosé Pine', '#e0def4', '#191724', '#ebbcba', '#f6c177', '#6e6a86', '#c4a7e7', '#ebbcba', '#eb6f92', '#f6c177', '#e0def4', '#9ccfd8'),
  'rose-pine-dawn': pack('rose-pine-dawn', 'Rosé Pine Dawn', '#575279', '#faf4ed', '#d7827e', '#ea9d34', '#9893a5', '#907aa9', '#d7827e', '#b4637a'),
  'gruvbox-dark-medium': pack('gruvbox-dark-medium', 'Gruvbox Dark', '#ebdbb2', '#282828', '#d3869b', '#b8bb26', '#928374', '#fb4934', '#fe8019', '#83a598', '#b8bb26', '#ebdbb2', '#8ec07c'),
  'gruvbox-light-medium': pack('gruvbox-light-medium', 'Gruvbox Light', '#3c3836', '#fbf1c7', '#8f3f71', '#79740e', '#928374', '#9d0006', '#af3a03', '#076678'),
  'solarized-dark': pack('solarized-dark', 'Solarized Dark', '#839496', '#002b36', '#cb4b16', '#2aa198', '#586e75', '#859900', '#b58900', '#268bd2'),
  'solarized-light': pack('solarized-light', 'Solarized Light', '#657b83', '#fdf6e3', '#cb4b16', '#2aa198', '#93a1a1', '#859900', '#b58900', '#268bd2'),
  'night-owl': pack('night-owl', 'Night Owl', '#d6deeb', '#011627', '#f78c6c', '#ecc48d', '#637777', '#c792ea', '#ffcb8b', '#82aaff', '#ecc48d', '#d6deeb', '#7fdbca'),
  'material-theme-palenight': pack('material-theme-palenight', 'Material Palenight', '#a6accd', '#292d3e', '#f78c6c', '#c3e88d', '#676e95', '#c792ea', '#f78c6c', '#82aaff'),
  'kanagawa-wave': pack('kanagawa-wave', 'Kanagawa Wave', '#dcd7ba', '#1f1f28', '#ffa066', '#98bb6c', '#727169', '#957fb8', '#ff9e3b', '#7e9cd8', '#98bb6c', '#dcd7ba', '#7fb4ca'),
  'synthwave-84': pack('synthwave-84', 'Synthwave \'84', '#ffffff', '#262335', '#f97e72', '#ff8b39', '#848bbd', '#fede5d', '#f97e72', '#36f9f6', '#ff8b39', '#ffffff', '#36f9f6'),
  'vitesse-dark': pack('vitesse-dark', 'Vitesse Dark', '#dbd7caee', '#121212', '#4d9375', '#c98a7d', '#758575dd', '#cb7676', '#d4976c', '#80a665'),
  'vitesse-light': pack('vitesse-light', 'Vitesse Light', '#393a34', '#ffffff', '#1c6b48', '#b56959', '#a0ada0', '#ab5959', '#a65e2b', '#59873a'),
  poimandres: pack('poimandres', 'Poimandres', '#a6accd', '#1b1e28', '#add7ff', '#5de4c7', '#767c9d', '#fffac2', '#e4f0fb', '#add7ff', '#5de4c7', '#a6accd', '#89ddff'),
  'ayu-dark': pack('ayu-dark', 'Ayu Dark', '#bfbdb6', '#0b0e14', '#ff8f40', '#aad94c', '#acb6bf8c', '#ff8f40', '#d2a6ff', '#ffb454'),
  'min-dark': pack('min-dark', 'Min Dark', '#b392f0', '#1f1f1f', '#f97583', '#9ecbff', '#6a737d', '#f97583', '#ffab70', '#b392f0'),
  'everforest-dark': pack('everforest-dark', 'Everforest Dark', '#d3c6aa', '#2d353b', '#e69875', '#a7c080', '#859289', '#e67e80', '#dbbc7f', '#7fbbb3'),
  houston: pack('houston', 'Houston', '#eef0f9', '#17191e', '#54b0fc', '#9a70ff', '#bfc2c7', '#54b0fc', '#ff8e4a', '#ff57bb'),
};

export function listShikiThemes(): ShikiThemePack[] {
  return Object.values(SHIKI_THEMES);
}

export function getShikiTheme(id: string): ShikiThemePack {
  return SHIKI_THEMES[id] ?? SHIKI_THEMES.echoes;
}
