import type { Element } from 'hast';
import type { ShikiTransformer } from 'shiki';

/**
 * Stamp 1-based `data-line` on each highlighted line so a sibling
 * player can mark the current statement without re-highlighting.
 */
export const lineNumberTransformer: ShikiTransformer = {
  name: 'curlswigger-data-line',
  line(hast: Element, line: number) {
    hast.properties ??= {};
    hast.properties['data-line'] = String(line);
  },
};
