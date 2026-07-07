// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  output: 'static',
  site: 'https://curlswiggerlabs.echoesofwhoami.com',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
