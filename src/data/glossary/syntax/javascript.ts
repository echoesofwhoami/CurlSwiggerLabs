import type { CodeLang, GlossaryEntry, GlossaryMatch } from '../types';

function js(...tokens: string[]): GlossaryMatch {
  return { langs: ['javascript'], tokens };
}

function jsExtra(
  tokens: string[],
  extraLangs: CodeLang[],
  firstOnly?: boolean,
): GlossaryMatch {
  const match: GlossaryMatch = { langs: ['javascript', ...extraLangs], tokens };
  if (firstOnly !== undefined) match.firstOnly = firstOnly;
  return match;
}

export const JAVASCRIPT_SYNTAX: GlossaryEntry[] = [
  {
    id: 'syntax.js.const',
    kind: 'syntax',
    match: js('const'),
    term: { en: 'const' },
    short: {
      en: 'Declares a block-scoped binding that cannot be reassigned. Properties of an object it points to can still change.',
    },
  },
  {
    id: 'syntax.js.let',
    kind: 'syntax',
    match: js('let'),
    term: { en: 'let' },
    short: {
      en: 'Declares a block-scoped variable that can be reassigned. Unlike `var`, it is not visible as a `window` property at top level.',
    },
  },
  {
    id: 'syntax.js.var',
    kind: 'syntax',
    match: js('var'),
    term: { en: 'var' },
    short: {
      en: 'Declares a function-scoped variable, hoisted to the top of its function. A top-level `var` also becomes a property of `window`.',
    },
  },
  {
    id: 'syntax.js.function',
    kind: 'syntax',
    match: js('function'),
    term: { en: 'function' },
    short: {
      en: 'Declares a named function. Function declarations are hoisted, so they can be called before the line that defines them.',
    },
  },
  {
    id: 'syntax.js.return',
    kind: 'syntax',
    match: js('return'),
    term: { en: 'return' },
    short: {
      en: 'Exits the current function and yields the value that follows. With no value, the function returns `undefined`.',
    },
  },
  {
    id: 'syntax.js.async',
    kind: 'syntax',
    match: js('async'),
    term: { en: 'async' },
    short: {
      en: 'Marks a function as asynchronous. That function always returns a Promise, even if the body uses `return` with a plain value.',
    },
  },
  {
    id: 'syntax.js.await',
    kind: 'syntax',
    match: js('await'),
    term: { en: 'await' },
    short: {
      en: 'Pauses an `async` function until a Promise settles, then continues with the resolved value. It can only appear inside `async` functions.',
    },
  },
  {
    id: 'syntax.js.typeof',
    kind: 'syntax',
    match: js('typeof'),
    term: { en: 'typeof' },
    short: {
      en: 'Returns a string naming the operand\'s type, such as `"string"` or `"undefined"`. `typeof null` is `"object"`, a long-standing language quirk.',
    },
  },
  {
    id: 'syntax.js.document',
    kind: 'syntax',
    match: js('document'),
    term: { en: 'document' },
    short: {
      en: 'The DOM object for the current page. Scripts read and change elements through this object.',
    },
  },
  {
    id: 'syntax.js.window',
    kind: 'syntax',
    match: js('window'),
    term: { en: 'window' },
    short: {
      en: 'The browser\'s global object for the tab. Bare names like `location` are usually properties of `window`.',
    },
  },
  {
    id: 'syntax.js.getElementById',
    kind: 'syntax',
    match: js('getElementById'),
    term: { en: 'getElementById' },
    short: {
      en: 'Returns the element with that `id`, or `null` if none exists. IDs are unique in a well-formed page.',
    },
  },
  {
    id: 'syntax.js.createElement',
    kind: 'syntax',
    match: js('createElement'),
    term: { en: 'createElement' },
    short: {
      en: 'Builds a new element of the given tag name. It is not in the page until something like `appendChild` inserts it.',
    },
  },
  {
    id: 'syntax.js.appendChild',
    kind: 'syntax',
    match: js('appendChild'),
    term: { en: 'appendChild' },
    short: {
      en: 'Inserts a node as the last child of a parent element. The node then becomes part of the live DOM.',
    },
  },
  {
    id: 'syntax.js.querySelector',
    kind: 'syntax',
    match: js('querySelector'),
    term: { en: 'querySelector' },
    short: {
      en: 'Returns the first element that matches a CSS selector, or `null`. Unlike `getElementById`, it can match classes, attributes, and nested paths.',
    },
  },
  {
    id: 'syntax.js.querySelectorAll',
    kind: 'syntax',
    match: js('querySelectorAll'),
    term: { en: 'querySelectorAll' },
    short: {
      en: 'Returns a static NodeList of every element matching a CSS selector. The list does not update if the DOM later changes.',
    },
  },
  {
    id: 'syntax.js.fetch',
    kind: 'syntax',
    match: js('fetch'),
    term: { en: 'fetch' },
    short: {
      en: 'Sends an HTTP request and returns a Promise for the Response. The body is not parsed until `.json()` or `.text()` is called.',
    },
  },
  {
    id: 'syntax.js.JSON.parse',
    kind: 'syntax',
    match: js('JSON.parse'),
    term: { en: 'JSON.parse' },
    short: {
      en: 'Turns a JSON string into a JavaScript value. Invalid JSON throws a SyntaxError.',
    },
  },
  {
    id: 'syntax.js.JSON.stringify',
    kind: 'syntax',
    match: js('JSON.stringify'),
    term: { en: 'JSON.stringify' },
    short: {
      en: 'Turns a JavaScript value into a JSON string. Functions and `undefined` are omitted from objects.',
    },
  },
  {
    id: 'syntax.js.addEventListener',
    kind: 'syntax',
    match: js('addEventListener'),
    term: { en: 'addEventListener' },
    short: {
      en: 'Registers a function to run when an event fires on that target, such as `click` or `DOMContentLoaded`.',
    },
  },
  {
    id: 'syntax.js.undefined',
    kind: 'syntax',
    match: js('undefined'),
    term: { en: 'undefined' },
    short: {
      en: 'The value of a declared variable with no assignment, and of a missing object property. It is not the same as `null`.',
    },
  },
  {
    id: 'syntax.js.__proto__',
    kind: 'syntax',
    match: jsExtra(['__proto__'], ['json', 'bash'], false),
    term: { en: '__proto__' },
    short: {
      en: 'An accessor for an object\'s prototype. In a recursive merge, a `"__proto__"` key can make assignments land on `Object.prototype` instead of on a nested field.',
    },
  },
  {
    id: 'syntax.js.constructor',
    kind: 'syntax',
    match: jsExtra(['constructor'], ['json']),
    term: { en: 'constructor' },
    short: {
      en: 'Points at the function that created the object. Writing `obj.constructor.prototype` is another path to pollute a shared prototype.',
    },
  },
  {
    id: 'syntax.js.prototype',
    kind: 'syntax',
    match: jsExtra(['Object.prototype', 'prototype'], ['json']),
    term: { en: 'prototype' },
    short: {
      en: 'The object other instances inherit from. Assigning to `Object.prototype` or `constructor.prototype` makes later lookups on many objects see the new property.',
    },
  },
];
