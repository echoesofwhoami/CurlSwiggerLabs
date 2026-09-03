/**
 * Chromium-shaped DOM clobbering and innerHTML sink model.
 * Runs in the reader's browser but never touches the page `window`
 * and never inserts parsed markup into the article DOM.
 */

export const LAB_PAYLOAD =
  '<a id=defaultAvatar><a id=defaultAvatar name=avatar href="cid:&quot;onerror=alert(1)//">';

export const FALLBACK_AVATAR = '/resources/images/avatarDefault.svg';

const ALLOWED_BODY_TAGS = new Set([
  'A',
  'B',
  'I',
  'EM',
  'STRONG',
  'P',
  'BR',
  'SPAN',
  'DIV',
  'UL',
  'OL',
  'LI',
  'IMG',
]);

const A_ATTRS = new Set(['id', 'name', 'href']);

export interface LabComment {
  name: string;
  body: string;
  avatar: string;
  date?: string;
}

export interface SinkResult {
  raw: string;
  attrs: Record<string, string>;
  wouldExecute: boolean;
  handlerCode: string;
}

export type ClobberValue =
  | { kind: 'undefined' }
  | { kind: 'fallback'; avatar: string }
  | { kind: 'element'; tag: string; id: string; name: string; href: string }
  | {
      kind: 'collection';
      items: { tag: string; id: string; name: string; href: string }[];
    };

export interface NamedLookup {
  chrome: ClobberValue;
  firefox: ClobberValue;
  chromeAvatar: string | undefined;
  firefoxAvatar: string | undefined;
}

export interface DomView {
  tag: string;
  id: string;
  name: string;
  href: string;
  extra?: string;
  highlight?: boolean;
  pending?: boolean;
  children: DomView[];
}

function attrValue(id: string): string {
  return id.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function elView(el: Element): { tag: string; id: string; name: string; href: string } {
  return {
    tag: el.tagName.toLowerCase(),
    id: el.getAttribute('id') ?? '',
    name: el.getAttribute('name') ?? '',
    href: el.getAttribute('href') ?? '',
  };
}

function liveNamedHref(root: ParentNode, prop: string): string | undefined {
  const named = Array.from(root.querySelectorAll(`a[name="${attrValue(prop)}"], a[id="${attrValue(prop)}"]`));
  if (named.length !== 1) return undefined;
  const href = named[0]!.getAttribute('href');
  return href === null ? undefined : href;
}

function parseFragment(html: string): Document {
  return new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
}

/**
 * Lab-shaped DOMPurify 2.0.15: keep boring markup, drop handlers and
 * script-ish tags. `cid:` hrefs keep a literal `"`. Common web schemes
 * percent-encode `"`. `javascript:` / `data:` hrefs are removed.
 */
export function sanitizeCommentHtml(html: string): string {
  try {
    return sanitizeCommentHtmlInner(html);
  } catch {
    return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

function sanitizeCommentHtmlInner(html: string): string {
  const doc = parseFragment(html);
  const out = doc.createElement('div');
  for (const node of Array.from(doc.body.childNodes)) {
    const next = sanitizeNode(node, doc);
    if (next) out.appendChild(next);
  }
  return out.innerHTML;
}

function sanitizeNode(node: Node, doc: Document): Node | null {
  if (node.nodeType === Node.TEXT_NODE) return node.cloneNode(true);
  if (!(node instanceof Element)) return null;
  const tag = node.tagName.toUpperCase();
  if (!ALLOWED_BODY_TAGS.has(tag)) {
    const wrap = doc.createDocumentFragment();
    for (const child of Array.from(node.childNodes)) {
      const next = sanitizeNode(child, doc);
      if (next) wrap.appendChild(next);
    }
    return wrap.childNodes.length > 0 ? wrap : null;
  }

  const clone = doc.createElement(tag.toLowerCase());
  if (tag === 'A') {
    for (const attr of Array.from(node.attributes)) {
      const name = attr.name.toLowerCase();
      if (!A_ATTRS.has(name)) continue;
      if (name === 'href') {
        const next = sanitizeHref(attr.value);
        if (next === null) continue;
        clone.setAttribute('href', next);
      } else {
        clone.setAttribute(name, attr.value);
      }
    }
  } else if (tag === 'IMG') {
    for (const attr of Array.from(node.attributes)) {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on') || name === 'style') continue;
      if (name === 'src') {
        const next = sanitizeHref(attr.value);
        if (next === null) continue;
        clone.setAttribute('src', next);
      } else {
        clone.setAttribute(name, attr.value);
      }
    }
  } else {
    for (const attr of Array.from(node.attributes)) {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on') || name === 'style') continue;
      clone.setAttribute(name, attr.value);
    }
  }
  for (const child of Array.from(node.childNodes)) {
    const next = sanitizeNode(child, doc);
    if (next) clone.appendChild(next);
  }
  return clone;
}

export function sanitizeHref(href: string): string | null {
  const trimmed = href.trim();
  const match = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(trimmed);
  if (!match) {
    return trimmed.replace(/"/g, '%22');
  }
  const scheme = match[1].toLowerCase();
  if (scheme === 'javascript' || scheme === 'data' || scheme === 'vbscript') {
    return null;
  }
  if (scheme === 'cid') {
    return trimmed;
  }
  if (
    scheme === 'http' ||
    scheme === 'https' ||
    scheme === 'ftp' ||
    scheme === 'mailto' ||
    scheme === 'tel' ||
    scheme === 'xmpp' ||
    scheme === 'callto'
  ) {
    return trimmed.replace(/"/g, '%22');
  }
  return null;
}

export function escapeHTML(data: string): string {
  return data.replace(/[<>'"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

/**
 * HTML5-ish start-tag parse of the avatar `innerHTML` string.
 * Does not create an `<img>` node, so `onerror` cannot run.
 */
export function parseImgSink(avatarSrc: unknown): SinkResult {
  const raw = `<img class="avatar" src="${String(avatarSrc)}">`;
  const attrs = parseStartTagAttrs(raw);
  const handler = attrs.onerror ?? attrs.onload ?? '';
  const wouldExecute = Boolean(handler.trim());
  return { raw, attrs, wouldExecute, handlerCode: handler };
}

type AttrState =
  | 'beforeName'
  | 'name'
  | 'afterName'
  | 'beforeValue'
  | 'valueUnquoted'
  | 'valueQuoted';

function parseStartTagAttrs(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const start = tag.indexOf('<');
  if (start === -1) return attrs;
  let i = start + 1;
  while (i < tag.length && /[A-Za-z]/.test(tag[i]!)) i++;

  let state: AttrState = 'beforeName';
  let name = '';
  let value = '';
  let quote = '';

  const commit = (): void => {
    if (name) attrs[name.toLowerCase()] = value;
    name = '';
    value = '';
    quote = '';
  };

  for (; i < tag.length; i++) {
    const c = tag[i]!;
    if (state === 'beforeName') {
      if (c === '>') break;
      if (/\s/.test(c) || c === '/') continue;
      name = c;
      state = 'name';
    } else if (state === 'name') {
      if (c === '>') {
        commit();
        break;
      }
      if (/\s/.test(c)) {
        state = 'afterName';
      } else if (c === '=') {
        state = 'beforeValue';
      } else {
        name += c;
      }
    } else if (state === 'afterName') {
      if (c === '>') {
        commit();
        break;
      }
      if (/\s/.test(c)) continue;
      if (c === '=') {
        state = 'beforeValue';
      } else {
        commit();
        name = c;
        state = 'name';
      }
    } else if (state === 'beforeValue') {
      if (c === '>') {
        commit();
        break;
      }
      if (/\s/.test(c)) continue;
      if (c === '"' || c === "'") {
        quote = c;
        value = '';
        state = 'valueQuoted';
      } else {
        value = c;
        state = 'valueUnquoted';
      }
    } else if (state === 'valueQuoted') {
      if (c === quote) {
        commit();
        state = 'beforeName';
      } else {
        value += c;
      }
    } else if (state === 'valueUnquoted') {
      if (c === '>') {
        commit();
        break;
      }
      if (/\s/.test(c)) {
        commit();
        state = 'beforeName';
      } else {
        // Spec: `"` in an unquoted value is a parse error but is still appended.
        value += c;
      }
    }
  }
  return attrs;
}

export function lookupNamed(
  root: ParentNode,
  id: string,
): { chrome: ClobberValue; firefox: ClobberValue } {
  const matches = Array.from(root.querySelectorAll(`[id="${attrValue(id)}"]`));
  const firefox: ClobberValue =
    matches.length === 0
      ? { kind: 'undefined' }
      : { kind: 'element', ...elView(matches[0]!) };

  let chrome: ClobberValue;
  if (matches.length === 0) {
    chrome = { kind: 'undefined' };
  } else if (matches.length === 1) {
    chrome = { kind: 'element', ...elView(matches[0]!) };
  } else {
    chrome = { kind: 'collection', items: matches.map(elView) };
  }
  return { chrome, firefox };
}

/** Chromium HTMLCollection named getter: a lone `<a>` yields its href string. */
export function collectionNamedGet(
  value: ClobberValue,
  prop: string,
): string | undefined {
  if (value.kind === 'fallback') {
    return prop === 'avatar' ? value.avatar : undefined;
  }
  if (value.kind === 'element') {
    return undefined;
  }
  if (value.kind !== 'collection') return undefined;
  const named = value.items.filter((item) => item.id === prop || item.name === prop);
  if (named.length === 1 && named[0]!.tag === 'a') {
    return named[0]!.href;
  }
  return undefined;
}

export function isTruthyClobber(value: ClobberValue): boolean {
  return value.kind !== 'undefined';
}

export function formatClobber(value: ClobberValue): string {
  if (value.kind === 'undefined') return 'undefined';
  if (value.kind === 'fallback') {
    return `{ avatar: ${JSON.stringify(value.avatar)} }`;
  }
  if (value.kind === 'element') {
    return describeElement(value);
  }
  const inner = value.items.map(describeElement).join(', ');
  return `HTMLCollection(${value.items.length}) [${inner}]`;
}

function describeElement(el: {
  tag: string;
  id: string;
  name: string;
  href: string;
}): string {
  const bits = [`<${el.tag}`];
  if (el.id) bits.push(` id=${JSON.stringify(el.id)}`);
  if (el.name) bits.push(` name=${JSON.stringify(el.name)}`);
  if (el.href) bits.push(` href=${JSON.stringify(el.href)}`);
  bits.push('>');
  return bits.join('');
}

export function formatMaybeString(value: string | undefined): string {
  if (value === undefined) return 'undefined';
  return JSON.stringify(value);
}

export interface ViewOpts {
  highlightId?: string;
  highlightScripts?: boolean;
  highlightPending?: boolean;
  highlightScriptSrc?: string;
  highlightInline?: boolean;
}

function nodeView(el: Element, opts: ViewOpts, pending: Element | null): DomView {
  const extraBits: string[] = [];
  if (el.tagName === 'IMG') {
    const src = el.getAttribute('data-src');
    const onerror = el.getAttribute('data-onerror');
    if (src !== null) extraBits.push(`src=${JSON.stringify(src)}`);
    if (onerror !== null) extraBits.push(`onerror=${JSON.stringify(onerror)}`);
  }
  if (el.tagName === 'SCRIPT') {
    const src = el.getAttribute('src');
    extraBits.push(src ? `src=${JSON.stringify(src)}` : 'inline');
    const inline = (el.textContent ?? '').trim();
    if (inline) extraBits.push(inline);
  }
  if (el.tagName === 'LINK') {
    const href = el.getAttribute('href');
    if (href) extraBits.push(`href=${JSON.stringify(href)}`);
  }
  if (el.tagName === 'FORM') {
    const action = el.getAttribute('action');
    if (action) extraBits.push(`action=${JSON.stringify(action)}`);
  }
  if (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'TITLE' || el.tagName === 'BUTTON') {
    const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (text) extraBits.push(text.length > 48 ? `${text.slice(0, 48)}...` : text);
  }
  const id = el.getAttribute('id') ?? '';
  const className = el.getAttribute('class') ?? '';
  const isPending = Boolean(pending && el === pending);
  const isScript = el.tagName === 'SCRIPT';
  const scriptSrc = isScript ? (el.getAttribute('src') ?? '') : '';
  const isInlineScript = isScript && !scriptSrc;
  const view: DomView = {
    tag: el.tagName.toLowerCase(),
    id,
    name: el.getAttribute('name') ?? '',
    href: el.getAttribute('href') ?? '',
    extra: extraBits.length > 0 ? extraBits.join(' ') : undefined,
    highlight: Boolean(
      (opts.highlightId && id === opts.highlightId) ||
        el.getAttribute('data-sink') === '1' ||
        (opts.highlightScripts && isScript) ||
        (opts.highlightScriptSrc && isScript && scriptSrc === opts.highlightScriptSrc) ||
        (opts.highlightInline && isInlineScript) ||
        (opts.highlightPending && isPending),
    ),
    pending: isPending,
    children: [],
  };
  if (className && !id) {
    view.extra = view.extra ? `${className} ${view.extra}` : className;
  } else if (className) {
    view.extra = view.extra ? `.${className.split(' ').join('.')} ${view.extra}` : `.${className.split(' ').join('.')}`;
  }
  for (const child of Array.from(el.children)) {
    view.children.push(nodeView(child, opts, pending));
  }
  return view;
}

export function viewPage(
  root: Element,
  opts: ViewOpts = {},
  pending: Element | null = null,
): DomView {
  return nodeView(root, { highlightId: 'defaultAvatar', ...opts }, pending);
}

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(value: string): string {
  return escapeText(value).replace(/"/g, '&quot;');
}

function serializeAttrs(el: Element): string {
  const parts: string[] = [];
  for (const attr of Array.from(el.attributes)) {
    let name = attr.name;
    if (name === 'data-sink') continue;
    if (name === 'data-src') name = 'src';
    else if (name === 'data-onerror') name = 'onerror';
    parts.push(` ${name}="${escapeAttr(attr.value)}"`);
  }
  return parts.join('');
}

function serializeElement(el: Element, indent: number): string {
  const pad = '  '.repeat(indent);
  const tag = el.tagName.toLowerCase();
  const open = `<${tag}${serializeAttrs(el)}>`;
  if (VOID_TAGS.has(tag)) return `${pad}${open}\n`;
  if (tag === 'script' || tag === 'style') {
    return `${pad}${open}${el.textContent ?? ''}</${tag}>\n`;
  }
  const kids = Array.from(el.childNodes).filter((node) => {
    if (node.nodeType === Node.TEXT_NODE) return (node.textContent ?? '').trim().length > 0;
    return node.nodeType === Node.ELEMENT_NODE;
  });
  if (kids.length === 0) return `${pad}${open}</${tag}>\n`;
  if (kids.length === 1 && kids[0]!.nodeType === Node.TEXT_NODE) {
    return `${pad}${open}${escapeText((kids[0]!.textContent ?? '').trim())}</${tag}>\n`;
  }
  const inner = kids
    .map((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return `${'  '.repeat(indent + 1)}${escapeText((node.textContent ?? '').trim())}\n`;
      }
      return serializeElement(node as Element, indent + 1);
    })
    .join('');
  return `${pad}${open}\n${inner}${pad}</${tag}>\n`;
}

/** Pretty source of the live sim document. Pending nodes are omitted. */
export function serializeSimPage(doc: Document): string {
  return `<!DOCTYPE html>\n${serializeElement(doc.documentElement, 0).trimEnd()}\n`;
}

export interface LoopState {
  simDoc: Document;
  userComments: HTMLElement;
  pending: HTMLElement | null;
}

export function createSimDom(pageHtml: string): LoopState {
  const simDoc = new DOMParser().parseFromString(pageHtml, 'text/html');
  const userComments = simDoc.getElementById('user-comments');
  if (!(userComments instanceof HTMLElement)) {
    throw new Error('approximate post HTML must include #user-comments');
  }
  return { simDoc, userComments, pending: null };
}

export interface CommentPass {
  lookup: NamedLookup;
  defaultAvatar: ClobberValue;
  avatarSrc: string;
  sink: SinkResult;
  sanitizedBody: string;
}

/**
 * One `displayComments` iteration against a detached Chromium-model DOM.
 * `append` is separate so the player can stop before ids hit `window`.
 */
export function beginCommentPass(
  state: LoopState,
  comment: LabComment,
  clobberId = 'defaultAvatar',
): CommentPass {
  const { chrome, firefox } = lookupNamed(state.userComments, clobberId);
  const liveAvatar = liveNamedHref(state.userComments, 'avatar');
  const chromeAvatar =
    chrome.kind === 'collection'
      ? (collectionNamedGet(chrome, 'avatar') ?? liveAvatar)
      : collectionNamedGet(chrome, 'avatar');
  const firefoxAvatar =
    firefox.kind === 'collection'
      ? (collectionNamedGet(firefox, 'avatar') ?? liveAvatar)
      : collectionNamedGet(firefox, 'avatar');

  const defaultAvatar: ClobberValue = isTruthyClobber(chrome)
    ? chrome
    : { kind: 'fallback', avatar: FALLBACK_AVATAR };

  const avatarSrc = comment.avatar
    ? escapeHTML(comment.avatar)
    : defaultAvatar.kind === 'fallback'
      ? defaultAvatar.avatar
      : (chromeAvatar ?? 'undefined');

  const sink = parseImgSink(avatarSrc);
  const sanitizedBody = comment.body ? sanitizeCommentHtml(comment.body) : '';

  return {
    lookup: { chrome, firefox, chromeAvatar, firefoxAvatar },
    defaultAvatar,
    avatarSrc,
    sink,
    sanitizedBody,
  };
}

export function startCommentSection(state: LoopState): HTMLElement {
  const section = state.simDoc.createElement('section');
  section.className = 'comment';
  state.pending = section;
  return section;
}

export function addAvatarToSection(
  state: LoopState,
  pass: CommentPass,
  highlightSink: boolean,
): void {
  if (!state.pending) startCommentSection(state);
  const divImg = state.simDoc.createElement('div');
  const img = state.simDoc.createElement('img');
  img.className = 'avatar';
  if (pass.sink.attrs.src !== undefined) img.setAttribute('data-src', pass.sink.attrs.src);
  if (pass.sink.attrs.onerror !== undefined) img.setAttribute('data-onerror', pass.sink.attrs.onerror);
  if (highlightSink && pass.sink.wouldExecute) img.setAttribute('data-sink', '1');
  divImg.appendChild(img);
  state.pending!.appendChild(divImg);
}

export function addBodyToSection(state: LoopState, pass: CommentPass): void {
  if (!state.pending || !pass.sanitizedBody) return;
  const bodyEl = state.simDoc.createElement('p');
  bodyEl.innerHTML = pass.sanitizedBody;
  state.pending.appendChild(bodyEl);
}

export function commitCommentSection(state: LoopState): HTMLElement | null {
  const section = state.pending;
  if (!section) return null;
  state.userComments.appendChild(section);
  state.pending = null;
  return section;
}

export function appendComment(
  state: LoopState,
  pass: CommentPass,
  highlightSink: boolean,
): HTMLElement {
  startCommentSection(state);
  addAvatarToSection(state, pass, highlightSink);
  addBodyToSection(state, pass);
  return commitCommentSection(state)!;
}
