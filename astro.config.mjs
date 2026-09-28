// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { placeholderTransformer } from './src/shiki/placeholder-transformer.ts';
import { tooltipTransformer } from './src/shiki/tooltip-transformer.ts';
import { copyButtonTransformer } from './src/shiki/copy-button-transformer.ts';
import { cssVariablesTheme } from './src/styles/shiki-css-theme.ts';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    sitemap(),
  ],
  output: 'static',
  site: 'https://curlswiggerlabs.echoesofwhoami.com',
  markdown: {
    shikiConfig: {
      theme: cssVariablesTheme,
      transformers: [placeholderTransformer, tooltipTransformer(), copyButtonTransformer],
    },
  },
  vite: {
    resolve: {
      alias: {
        '@assets': path.resolve(projectRoot, 'src/assets'),
        '@components': path.resolve(projectRoot, 'src/components'),
        '@data': path.resolve(projectRoot, 'src/data'),
        '@styles': path.resolve(projectRoot, 'src/styles'),
        '@types': path.resolve(projectRoot, 'src/types'),
        '@utils': path.resolve(projectRoot, 'src/utils'),
      },
    },
  },
});
