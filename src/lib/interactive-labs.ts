export const INTERACTIVE_LABS = {
  'exploiting-dom-clobbering-to-enable-xss': {
    scenario: 'dom-clobbering' as const,
  },
} as const;

export type InteractiveLabSlug = keyof typeof INTERACTIVE_LABS;

export function isInteractiveLabSlug(slug: string): slug is InteractiveLabSlug {
  return slug in INTERACTIVE_LABS;
}
