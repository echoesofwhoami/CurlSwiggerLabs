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
    term: { en: 'const', es: 'const' },
    short: {
      en: 'Declares a block-scoped binding that cannot be reassigned. Properties of an object it points to can still change.',
      es: 'Declara un enlace de ámbito de bloque que no se puede reasignar. Las propiedades del objeto al que apunta sí pueden cambiar.',
    },
  },
  {
    id: 'syntax.js.let',
    kind: 'syntax',
    match: js('let'),
    term: { en: 'let', es: 'let' },
    short: {
      en: 'Declares a block-scoped variable that can be reassigned. Unlike `var`, it is not visible as a `window` property at top level.',
      es: 'Declara una variable de ámbito de bloque que sí se puede reasignar. A diferencia de `var`, en el nivel superior no aparece como propiedad de `window`.',
    },
  },
  {
    id: 'syntax.js.var',
    kind: 'syntax',
    match: js('var'),
    term: { en: 'var', es: 'var' },
    short: {
      en: 'Declares a function-scoped variable, hoisted to the top of its function. A top-level `var` also becomes a property of `window`.',
      es: 'Declara una variable de ámbito de función, elevada al inicio de esa función. Un `var` de nivel superior también se convierte en propiedad de `window`.',
    },
  },
  {
    id: 'syntax.js.function',
    kind: 'syntax',
    match: js('function'),
    term: { en: 'function', es: 'function' },
    short: {
      en: 'Declares a named function. Function declarations are hoisted, so they can be called before the line that defines them.',
      es: 'Declara una función con nombre. Las declaraciones se elevan, así que se pueden llamar antes de la línea que las define.',
    },
  },
  {
    id: 'syntax.js.return',
    kind: 'syntax',
    match: js('return'),
    term: { en: 'return', es: 'return' },
    short: {
      en: 'Exits the current function and yields the value that follows. With no value, the function returns `undefined`.',
      es: 'Sale de la función actual y devuelve el valor que sigue. Sin valor, la función retorna `undefined`.',
    },
  },
  {
    id: 'syntax.js.async',
    kind: 'syntax',
    match: js('async'),
    term: { en: 'async', es: 'async' },
    short: {
      en: 'Marks a function as asynchronous. That function always returns a Promise, even if the body uses `return` with a plain value.',
      es: 'Marca una función como asíncrona. Esa función siempre devuelve una Promise, aunque el cuerpo haga `return` de un valor normal.',
    },
  },
  {
    id: 'syntax.js.await',
    kind: 'syntax',
    match: js('await'),
    term: { en: 'await', es: 'await' },
    short: {
      en: 'Pauses an `async` function until a Promise settles, then continues with the resolved value. It can only appear inside `async` functions.',
      es: 'Pausa una función `async` hasta que una Promise se resuelve y continúa con ese valor. Solo puede aparecer dentro de funciones `async`.',
    },
  },
  {
    id: 'syntax.js.typeof',
    kind: 'syntax',
    match: js('typeof'),
    term: { en: 'typeof', es: 'typeof' },
    short: {
      en: 'Returns a string naming the operand\'s type, such as `"string"` or `"undefined"`. `typeof null` is `"object"`, a long-standing language quirk.',
      es: 'Devuelve una cadena con el tipo del operando, por ejemplo `"string"` o `"undefined"`. `typeof null` es `"object"`, una rareza antigua del lenguaje.',
    },
  },
  {
    id: 'syntax.js.document',
    kind: 'syntax',
    match: js('document'),
    term: { en: 'document', es: 'document' },
    short: {
      en: 'The DOM object for the current page. Scripts read and change elements through this object.',
      es: 'El objeto DOM de la página actual. Los scripts leen y modifican elementos a través de este objeto.',
    },
  },
  {
    id: 'syntax.js.window',
    kind: 'syntax',
    match: js('window'),
    term: { en: 'window', es: 'window' },
    short: {
      en: 'The browser\'s global object for the tab. Bare names like `location` are usually properties of `window`.',
      es: 'El objeto global del navegador para esa pestaña. Nombres sueltos como `location` suelen ser propiedades de `window`.',
    },
  },
  {
    id: 'syntax.js.getElementById',
    kind: 'syntax',
    match: js('getElementById'),
    term: { en: 'getElementById', es: 'getElementById' },
    short: {
      en: 'Returns the element with that `id`, or `null` if none exists. IDs are unique in a well-formed page.',
      es: 'Devuelve el elemento con ese `id`, o `null` si no existe. En una página bien formada los IDs son únicos.',
    },
  },
  {
    id: 'syntax.js.createElement',
    kind: 'syntax',
    match: js('createElement'),
    term: { en: 'createElement', es: 'createElement' },
    short: {
      en: 'Builds a new element of the given tag name. It is not in the page until something like `appendChild` inserts it.',
      es: 'Crea un elemento nuevo con el nombre de etiqueta indicado. No está en la página hasta que algo como `appendChild` lo inserta.',
    },
  },
  {
    id: 'syntax.js.appendChild',
    kind: 'syntax',
    match: js('appendChild'),
    term: { en: 'appendChild', es: 'appendChild' },
    short: {
      en: 'Inserts a node as the last child of a parent element. The node then becomes part of the live DOM.',
      es: 'Inserta un nodo como último hijo de un elemento padre. El nodo pasa a formar parte del DOM en vivo.',
    },
  },
  {
    id: 'syntax.js.querySelector',
    kind: 'syntax',
    match: js('querySelector'),
    term: { en: 'querySelector', es: 'querySelector' },
    short: {
      en: 'Returns the first element that matches a CSS selector, or `null`. Unlike `getElementById`, it can match classes, attributes, and nested paths.',
      es: 'Devuelve el primer elemento que coincide con un selector CSS, o `null`. A diferencia de `getElementById`, puede buscar clases, atributos y rutas anidadas.',
    },
  },
  {
    id: 'syntax.js.querySelectorAll',
    kind: 'syntax',
    match: js('querySelectorAll'),
    term: { en: 'querySelectorAll', es: 'querySelectorAll' },
    short: {
      en: 'Returns a static NodeList of every element matching a CSS selector. The list does not update if the DOM later changes.',
      es: 'Devuelve un NodeList estático con todos los elementos que coinciden con un selector CSS. La lista no se actualiza si el DOM cambia después.',
    },
  },
  {
    id: 'syntax.js.fetch',
    kind: 'syntax',
    match: js('fetch'),
    term: { en: 'fetch', es: 'fetch' },
    short: {
      en: 'Sends an HTTP request and returns a Promise for the Response. The body is not parsed until `.json()` or `.text()` is called.',
      es: 'Envía una petición HTTP y devuelve una Promise con la Response. El cuerpo no se interpreta hasta llamar a `.json()` o `.text()`.',
    },
  },
  {
    id: 'syntax.js.JSON.parse',
    kind: 'syntax',
    match: js('JSON.parse'),
    term: { en: 'JSON.parse', es: 'JSON.parse' },
    short: {
      en: 'Turns a JSON string into a JavaScript value. Invalid JSON throws a SyntaxError.',
      es: 'Convierte una cadena JSON en un valor de JavaScript. Un JSON inválido lanza un SyntaxError.',
    },
  },
  {
    id: 'syntax.js.JSON.stringify',
    kind: 'syntax',
    match: js('JSON.stringify'),
    term: { en: 'JSON.stringify', es: 'JSON.stringify' },
    short: {
      en: 'Turns a JavaScript value into a JSON string. Functions and `undefined` are omitted from objects.',
      es: 'Convierte un valor de JavaScript en una cadena JSON. Las funciones y `undefined` se omiten en los objetos.',
    },
  },
  {
    id: 'syntax.js.addEventListener',
    kind: 'syntax',
    match: js('addEventListener'),
    term: { en: 'addEventListener', es: 'addEventListener' },
    short: {
      en: 'Registers a function to run when an event fires on that target, such as `click` or `DOMContentLoaded`.',
      es: 'Registra una función que se ejecuta cuando ocurre un evento en ese objetivo, por ejemplo `click` o `DOMContentLoaded`.',
    },
  },
  {
    id: 'syntax.js.undefined',
    kind: 'syntax',
    match: js('undefined'),
    term: { en: 'undefined', es: 'undefined' },
    short: {
      en: 'The value of a declared variable with no assignment, and of a missing object property. It is not the same as `null`.',
      es: 'El valor de una variable declarada sin asignación, y de una propiedad de objeto que no existe. No es lo mismo que `null`.',
    },
  },
  {
    id: 'syntax.js.__proto__',
    kind: 'syntax',
    match: jsExtra(['__proto__'], ['json', 'bash'], false),
    term: { en: '__proto__', es: '__proto__' },
    short: {
      en: 'An accessor for an object\'s prototype. In a recursive merge, a `"__proto__"` key can make assignments land on `Object.prototype` instead of on a nested field.',
      es: 'Un accesor al prototipo de un objeto. En un merge recursivo, una clave `"__proto__"` puede hacer que las asignaciones caigan en `Object.prototype` en lugar de en un campo anidado.',
    },
  },
  {
    id: 'syntax.js.constructor',
    kind: 'syntax',
    match: jsExtra(['constructor'], ['json']),
    term: { en: 'constructor', es: 'constructor' },
    short: {
      en: 'Points at the function that created the object. Writing `obj.constructor.prototype` is another path to pollute a shared prototype.',
      es: 'Apunta a la función que creó el objeto. Escribir `obj.constructor.prototype` es otro camino para contaminar un prototipo compartido.',
    },
  },
  {
    id: 'syntax.js.prototype',
    kind: 'syntax',
    match: jsExtra(['Object.prototype', 'prototype'], ['json']),
    term: { en: 'prototype', es: 'prototype' },
    short: {
      en: 'The object other instances inherit from. Assigning to `Object.prototype` or `constructor.prototype` makes later lookups on many objects see the new property.',
      es: 'El objeto del que heredan otras instancias. Asignar a `Object.prototype` o `constructor.prototype` hace que lecturas posteriores en muchos objetos vean la propiedad nueva.',
    },
  },
];
