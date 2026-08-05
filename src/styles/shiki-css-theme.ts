import { createCssVariablesTheme } from 'shiki';

/** Shared Shiki theme that paints tokens via CSS custom properties. */
export const cssVariablesTheme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
  variableDefaults: {
    '--shiki-foreground': '#ffffff',
    '--shiki-background': '#000000',
    '--shiki-token-constant': '#d70000',
    '--shiki-token-string': '#FF5252',
    '--shiki-token-comment': '#888888',
    '--shiki-token-keyword': '#d70000',
    '--shiki-token-parameter': '#aaaaaa',
    '--shiki-token-function': '#d70000',
    '--shiki-token-string-expression': '#FF5252',
    '--shiki-token-punctuation': '#ffffff',
    '--shiki-token-link': '#FF5252',
  },
  fontStyle: true,
});
