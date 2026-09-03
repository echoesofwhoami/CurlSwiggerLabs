/// <reference types="astro/client" />

declare module '*.js?raw' {
  const src: string;
  export default src;
}

declare namespace App {
  interface Locals {
    portswiggerDescription?: string;
    postLang?: 'en' | 'es';
    usedTips?: Set<string>;
  }
}
