// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { placeholderTransformer } from './src/shiki/placeholder-transformer.ts';
import echoesTheme from './src/themes/echoes.json';

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          es: 'es-ES',
        },
      },
    }),
  ],
  output: 'static',
  site: 'https://curlswiggerlabs.echoesofwhoami.com',
  markdown: {
    shikiConfig: {
      theme: echoesTheme,
      transformers: [placeholderTransformer],
    },
  },
});

