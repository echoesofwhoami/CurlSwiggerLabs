/** Token colors follow the site Shiki CSS variables. */

export type HighlightLang = 'http' | 'json' | 'html' | 'javascript' | 'plaintext';

export type TokenKind = 'kw' | 'str' | 'fn' | 'cmt' | 'punct' | 'num' | 'tag' | 'attr';

export interface Token {
  text: string;
  kind?: TokenKind;
}

export interface SplitHttp {
  headers: string;
  body: string;
  bodyLang: HighlightLang;
}

const JS_KEYWORDS = new Set([
  'break',
  'case',
  'catch',
  'const',
  'continue',
  'default',
  'delete',
  'else',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'in',
  'instanceof',
  'let',
  'new',
  'null',
  'return',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'undefined',
  'var',
  'void',
  'while',
  'with',
]);

export function splitHttpMessage(raw: string): SplitHttp {
  const trimmed = raw.replace(/^\uFEFF/, '');
  const idx = trimmed.indexOf('\n\n');
  if (idx === -1) {
    return { headers: trimmed, body: '', bodyLang: 'plaintext' };
  }
  const headers = trimmed.slice(0, idx);
  const body = trimmed.slice(idx + 2);
  const ct = /^content-type:\s*([^\n;]+)/im.exec(headers)?.[1]?.trim().toLowerCase() ?? '';
  let bodyLang: HighlightLang = 'plaintext';
  if (ct.includes('json')) bodyLang = 'json';
  else if (ct.includes('html')) bodyLang = 'html';
  else if (ct.includes('javascript') || ct.includes('ecmascript')) bodyLang = 'javascript';
  return { headers, body, bodyLang };
}

export function tokenize(code: string, lang: HighlightLang): Token[] {
  if (lang === 'json') return tokenizeJson(code);
  if (lang === 'http') return tokenizeHttp(code);
  if (lang === 'html') return tokenizeHtml(code);
  if (lang === 'javascript') return tokenizeJs(code);
  return [{ text: code }];
}

export function renderHighlighted(target: HTMLElement, code: string, lang: HighlightLang): void {
  target.replaceChildren();
  for (const token of tokenize(code, lang)) {
    if (!token.kind) {
      target.append(token.text);
      continue;
    }
    const span = document.createElement('span');
    span.className = `tok-${token.kind}`;
    span.textContent = token.text;
    target.appendChild(span);
  }
}

function tokenizeHttp(src: string): Token[] {
  const tokens: Token[] = [];
  const lines = src.split('\n');
  lines.forEach((line, index) => {
    if (index > 0) tokens.push({ text: '\n' });
    if (!line) return;
    if (index === 0) {
      const start = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(\S+)\s+(HTTP\/[\d.]+)$/i.exec(line);
      if (start) {
        tokens.push({ text: start[1]!, kind: 'kw' });
        tokens.push({ text: ' ' });
        tokens.push({ text: start[2]!, kind: 'str' });
        tokens.push({ text: ' ' });
        tokens.push({ text: start[3]!, kind: 'punct' });
        return;
      }
      const status = /^(HTTP\/[\d.]+)\s+(\d{3})(?:\s+(.*))?$/i.exec(line);
      if (status) {
        tokens.push({ text: status[1]!, kind: 'kw' });
        tokens.push({ text: ' ' });
        tokens.push({ text: status[2]!, kind: 'num' });
        if (status[3]) {
          tokens.push({ text: ' ' });
          tokens.push({ text: status[3] });
        }
        return;
      }
      tokens.push({ text: line });
      return;
    }
    const colon = line.indexOf(':');
    if (colon > 0) {
      tokens.push({ text: line.slice(0, colon), kind: 'fn' });
      tokens.push({ text: ':', kind: 'punct' });
      tokens.push({ text: line.slice(colon + 1), kind: 'str' });
      return;
    }
    tokens.push({ text: line });
  });
  return tokens;
}

function tokenizeJson(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const push = (text: string, kind?: TokenKind): void => {
    if (text) tokens.push({ text, kind });
  };
  while (i < src.length) {
    const c = src[i]!;
    if (/\s/.test(c)) {
      let j = i + 1;
      while (j < src.length && /\s/.test(src[j]!)) j++;
      push(src.slice(i, j));
      i = j;
      continue;
    }
    if (c === '"') {
      let j = i + 1;
      while (j < src.length) {
        if (src[j] === '\\') {
          j += 2;
          continue;
        }
        if (src[j] === '"') {
          j++;
          break;
        }
        j++;
      }
      push(src.slice(i, j), 'str');
      i = j;
      continue;
    }
    if ('{}[],:'.includes(c)) {
      push(c, 'punct');
      i++;
      continue;
    }
    if (c === '-' || /[0-9]/.test(c)) {
      let j = i + 1;
      while (j < src.length && /[0-9.eE+-]/.test(src[j]!)) j++;
      push(src.slice(i, j), 'num');
      i = j;
      continue;
    }
    if (/[a-z]/.test(c)) {
      let j = i + 1;
      while (j < src.length && /[a-z]/.test(src[j]!)) j++;
      const word = src.slice(i, j);
      push(word, word === 'true' || word === 'false' || word === 'null' ? 'kw' : undefined);
      i = j;
      continue;
    }
    push(c);
    i++;
  }
  return tokens;
}

function tokenizeHtml(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const push = (text: string, kind?: TokenKind): void => {
    if (text) tokens.push({ text, kind });
  };
  while (i < src.length) {
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i + 4);
      const j = end === -1 ? src.length : end + 3;
      push(src.slice(i, j), 'cmt');
      i = j;
      continue;
    }
    if (src[i] === '<') {
      const end = findHtmlTagEnd(src, i);
      if (end === -1) {
        push(src.slice(i));
        break;
      }
      const tag = src.slice(i, end + 1);
      tokenizeHtmlTag(tag, push);
      i = end + 1;
      const open = /^<(script|style)\b/i.exec(tag);
      if (open && !tag.endsWith('/>')) {
        const close = new RegExp(`</${open[1]}\\s*>`, 'i').exec(src.slice(i));
        const innerEnd = close ? i + close.index : src.length;
        const inner = src.slice(i, innerEnd);
        if (open[1]!.toLowerCase() === 'script') {
          for (const token of tokenizeJs(inner)) push(token.text, token.kind);
        } else {
          push(inner);
        }
        i = innerEnd;
      }
      continue;
    }
    const next = src.indexOf('<', i);
    const j = next === -1 ? src.length : next;
    push(src.slice(i, j));
    i = j;
  }
  return tokens;
}

function findHtmlTagEnd(src: string, start: number): number {
  let quote: '"' | "'" | null = null;
  for (let i = start + 1; i < src.length; i++) {
    const c = src[i]!;
    if (quote) {
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      continue;
    }
    if (c === '>') return i;
  }
  return -1;
}

function tokenizeHtmlTag(
  tag: string,
  push: (text: string, kind?: TokenKind) => void,
): void {
  if (tag.startsWith('<!')) {
    push(tag, 'tag');
    return;
  }
  const close = tag.endsWith('/>') ? 2 : 1;
  const innerEnd = tag.length - close;
  push('<', 'punct');
  let i = 1;
  if (tag[1] === '/') {
    push('/', 'punct');
    i = 2;
  }
  let j = i;
  while (j < innerEnd && /[A-Za-z0-9:-]/.test(tag[j]!)) j++;
  push(tag.slice(i, j), 'tag');
  i = j;
  while (i < innerEnd) {
    while (i < innerEnd && /\s/.test(tag[i]!)) {
      push(tag[i]!);
      i++;
    }
    if (i >= innerEnd) break;
    j = i;
    while (j < innerEnd && /[A-Za-z0-9:-]/.test(tag[j]!)) j++;
    if (j === i) {
      push(tag.slice(i, innerEnd), 'punct');
      break;
    }
    push(tag.slice(i, j), 'attr');
    i = j;
    while (i < innerEnd && /\s/.test(tag[i]!)) {
      push(tag[i]!);
      i++;
    }
    if (tag[i] !== '=') continue;
    push('=', 'punct');
    i++;
    while (i < innerEnd && /\s/.test(tag[i]!)) {
      push(tag[i]!);
      i++;
    }
    if (tag[i] === '"' || tag[i] === "'") {
      const q = tag[i]!;
      j = i + 1;
      while (j < innerEnd && tag[j] !== q) j++;
      if (j < innerEnd) j++;
      push(tag.slice(i, j), 'str');
      i = j;
    } else {
      j = i;
      while (j < innerEnd && !/\s/.test(tag[j]!)) j++;
      push(tag.slice(i, j), 'str');
      i = j;
    }
  }
  if (close === 2) push('/>', 'punct');
  else push('>', 'punct');
}

function tokenizeJs(src: string): Token[] {
  const tokens: Token[] = [];
  let last: Token | undefined;
  const push = (text: string, kind?: TokenKind): void => {
    if (!text) return;
    const token: Token = kind ? { text, kind } : { text };
    tokens.push(token);
    if (!/^\s+$/.test(text)) last = token;
  };
  let i = 0;
  while (i < src.length) {
    if (src.startsWith('//', i)) {
      const end = src.indexOf('\n', i);
      const j = end === -1 ? src.length : end;
      push(src.slice(i, j), 'cmt');
      i = j;
      continue;
    }
    if (src.startsWith('/*', i)) {
      const end = src.indexOf('*/', i + 2);
      const j = end === -1 ? src.length : end + 2;
      push(src.slice(i, j), 'cmt');
      i = j;
      continue;
    }
    const c = src[i]!;
    if (c === '/' && jsRegexCanStart(last)) {
      const j = readJsRegex(src, i);
      if (j > i + 1) {
        push(src.slice(i, j), 'str');
        i = j;
        continue;
      }
    }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < src.length) {
        if (src[j] === '\\') {
          j += 2;
          continue;
        }
        if (src[j] === c) {
          j++;
          break;
        }
        j++;
      }
      push(src.slice(i, j), 'str');
      i = j;
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      let j = i + 1;
      while (j < src.length && /[A-Za-z0-9_$]/.test(src[j]!)) j++;
      const word = src.slice(i, j);
      push(word, JS_KEYWORDS.has(word) ? 'kw' : 'fn');
      i = j;
      continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i + 1;
      while (j < src.length && /[0-9.xXa-fA-F]/.test(src[j]!)) j++;
      push(src.slice(i, j), 'num');
      i = j;
      continue;
    }
    if ('(){}[];,.:=<>!+-*/%&|?'.includes(c)) {
      push(c, 'punct');
      i++;
      continue;
    }
    push(c);
    i++;
  }
  return tokens;
}

function jsRegexCanStart(last: Token | undefined): boolean {
  if (!last) return true;
  if (last.kind === 'fn' || last.kind === 'num' || last.kind === 'str') return false;
  if (last.kind === 'kw') return !['true', 'false', 'null', 'this'].includes(last.text);
  if (last.kind === 'punct') return last.text !== ')' && last.text !== ']' && last.text !== '.';
  return true;
}

function readJsRegex(src: string, start: number): number {
  let inClass = false;
  for (let i = start + 1; i < src.length; i++) {
    const c = src[i]!;
    if (c === '\n') return start;
    if (c === '\\') {
      i++;
      continue;
    }
    if (inClass) {
      if (c === ']') inClass = false;
      continue;
    }
    if (c === '[') {
      inClass = true;
      continue;
    }
    if (c === '/') {
      i++;
      while (i < src.length && /[A-Za-z]/.test(src[i]!)) i++;
      return i;
    }
  }
  return start;
}
