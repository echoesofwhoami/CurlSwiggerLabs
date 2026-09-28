/// <reference types="astro/client" />

import type { AppLocals } from './types/app'

declare global {
  namespace App {
    // Astro merges App.Locals only through an interface.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Locals extends AppLocals {}
  }
}
