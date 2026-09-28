import type { Element, Root } from 'hast'
import type { ShikiTransformer } from 'shiki'

/**
 * Wrap each highlighted `<pre>` in `.code-wrapper` with a copy button.
 * Skips blocks that already live under `.request-diff` or `.code-wrapper`.
 */
export const copyButtonTransformer: ShikiTransformer = {
  name: 'curlswigger-copy-button',
  root(hast) {
    wrapHighlightedPre(hast)
  },
}

function wrapHighlightedPre(root: Root) {
  if (hasClassName(root, 'request-diff')) return

  if (hasClassName(root, 'code-wrapper')) return

  const next: Root['children'] = []

  let wrapped = false

  for (const child of root.children) {
    if (!wrapped && child.type === 'element' && child.tagName === 'pre') {
      next.push(codeWrapper(child))

      wrapped = true

      continue
    }

    next.push(child)
  }

  if (!wrapped) return

  root.children = next
}

function codeWrapper(pre: Element): Element {
  const properties = { ...(pre.properties ?? {}) }

  properties.tabindex = '0'

  properties['data-copy-code-target'] = 'code'

  pre.properties = properties

  return {
    type: 'element',
    tagName: 'div',
    properties: {
      class: 'code-wrapper',
      'data-controller': 'copy-code',
    },
    children: [pre, copyButton()],
  }
}

function copyButton(): Element {
  return {
    type: 'element',
    tagName: 'button',
    properties: {
      type: 'button',
      class: 'copy-code',
      'data-action': 'click->copy-code#copy',
      'data-copy-code-target': 'button',
      'aria-label': 'Copy',
    },
    children: [{ type: 'text', value: 'Copy' }],
  }
}

function hasClassName(node: Root | Element, name: string): boolean {
  for (const child of node.children) {
    if (child.type !== 'element') continue

    if (classNames(child).includes(name)) return true

    if (hasClassName(child, name)) return true
  }

  return false
}

function classNames(el: Element): string[] {
  const props = el.properties

  if (!props) return []

  return [...namesOf(props.class), ...namesOf(props.className)]
}

function namesOf(value: unknown): string[] {
  if (typeof value === 'string') return value.split(/\s+/)

  if (!Array.isArray(value)) return []

  const names: string[] = []

  for (const part of value) names.push(String(part))

  return names
}
