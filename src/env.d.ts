/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    portswiggerDescription?: string;
    postLang?: 'en' | 'es';
    usedTips?: Set<string>;
  }
}
