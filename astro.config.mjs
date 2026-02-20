// @ts-check
import { defineConfig } from 'astro/config';
// @ts-ignore
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  output: 'static',
  site: 'https://echoesofwhoami.github.io',
  base: '/CurlSwiggerLabs',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
