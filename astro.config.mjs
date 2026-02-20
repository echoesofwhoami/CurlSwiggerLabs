// @ts-check
import { defineConfig } from 'astro/config';
// @ts-ignore
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  output: 'static',
  site: 'https://curlswiggerlabs.github.io',
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
