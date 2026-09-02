// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { spanishEnabled } from './src/i18n/ui.ts';
import { placeholderTransformer } from './src/shiki/placeholder-transformer.ts';
import { tooltipTransformer } from './src/shiki/tooltip-transformer.ts';
import { cssVariablesTheme } from './src/styles/shiki-css-theme.ts';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          ...(spanishEnabled ? { es: 'es-ES' } : {}),
        },
      },
      filter: (page) => spanishEnabled || !/\/es(\/|$)/.test(new URL(page).pathname),
    }),
  ],
  output: 'static',
  site: 'https://curlswiggerlabs.echoesofwhoami.com',
  markdown: {
    shikiConfig: {
      theme: cssVariablesTheme,
      transformers: [placeholderTransformer, tooltipTransformer('en')],
    },
  },
  vite: {
    resolve: {
      alias: {
        '@components': path.resolve(projectRoot, 'src/components'),
        '@data': path.resolve(projectRoot, 'src/data'),
      },
    },
  },
});
