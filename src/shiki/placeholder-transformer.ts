import type { Element, ElementContent } from 'hast';
import type { ShikiTransformer } from 'shiki';

const PLACEHOLDER = /<[A-Za-z][A-Za-z0-9_-]*>/g;
const PLACEHOLDER_COLOR = '#D70000';

function restyleColor(style: string, color: string): string {
  if (!style) return `color:${color}`;
  if (/color\s*:/.test(style)) {
    return style.replace(/color\s*:[^;]+/i, `color:${color}`);
  }
  return `color:${color};${style}`;
}

function styledText(value: string, style: string): Element {
  return {
    type: 'element',
    tagName: 'span',
    properties: style ? { style } : {},
    children: [{ type: 'text', value }],
  };
}

/**
 * Color `<placeholder>` tokens red in any language after Shiki highlighting.
 */
export const placeholderTransformer: ShikiTransformer = {
  name: 'curlswigger-placeholders',
  span(hast: Element) {
    const kids = hast.children;
    if (!kids || kids.length !== 1) return;

    const only = kids[0];
    if (only.type !== 'text') return;

    const value = only.value;
    PLACEHOLDER.lastIndex = 0;
    if (!PLACEHOLDER.test(value)) return;
    PLACEHOLDER.lastIndex = 0;

    const parentStyle =
      typeof hast.properties?.style === 'string' ? hast.properties.style : '';

    const parts: ElementContent[] = [];
    let last = 0;

    for (const match of value.matchAll(PLACEHOLDER)) {
      const start = match.index ?? 0;
      if (start > last) {
        parts.push(styledText(value.slice(last, start), parentStyle));
      }
      parts.push(styledText(match[0], restyleColor(parentStyle, PLACEHOLDER_COLOR)));
      last = start + match[0].length;
    }

    if (last < value.length) {
      parts.push(styledText(value.slice(last), parentStyle));
    }

    hast.children = parts;
    if (hast.properties?.style) {
      delete hast.properties.style;
    }
  },
};
