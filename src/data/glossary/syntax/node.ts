import type { CodeLang, GlossaryEntry, GlossaryMatch } from '../types';

function node(
  tokens: string[],
  opts?: { firstOnly?: boolean; extraLangs?: CodeLang[] },
): GlossaryMatch {
  const match: GlossaryMatch = {
    langs: ['javascript', ...(opts?.extraLangs ?? [])],
    tokens,
  };
  if (opts?.firstOnly !== undefined) {
    match.firstOnly = opts.firstOnly;
  }
  return match;
}

export const NODE_SYNTAX: GlossaryEntry[] = [
  {
    id: 'syntax.node.require',
    kind: 'syntax',
    match: node(['require'], { extraLangs: ['json', 'bash'] }),
    term: { en: 'require', es: 'require' },
    short: {
      en: 'Loads a CommonJS module and returns its exports. `require("child_process")` is how Node pulls in that built-in.',
      es: 'Carga un módulo CommonJS y devuelve sus exports. `require("child_process")` es cómo Node trae ese módulo integrado.',
    },
  },
  {
    id: 'syntax.node.child_process',
    kind: 'syntax',
    match: node(['child_process'], { firstOnly: false, extraLangs: ['json', 'bash'] }),
    term: { en: 'child_process', es: 'child_process' },
    short: {
      en: 'Node\'s built-in module for starting other processes. `fork`, `spawn`, and `execSync` all come from here, which is why it shows up in RCE gadgets.',
      es: 'El módulo integrado de Node para lanzar otros procesos. `fork`, `spawn` y `execSync` salen de aquí, por eso aparece en gadgets de RCE.',
    },
  },
  {
    id: 'syntax.node.fork',
    kind: 'syntax',
    match: node(['fork'], { firstOnly: false }),
    term: { en: 'fork', es: 'fork' },
    short: {
      en: 'Starts a new Node.js process that runs a module. On older Node, `fork` reads `execArgv` from the options object, including values inherited from `Object.prototype`.',
      es: 'Arranca un proceso Node.js nuevo que ejecuta un módulo. En Node antiguo, `fork` lee `execArgv` del objeto options, incluidos valores heredados de `Object.prototype`.',
    },
  },
  {
    id: 'syntax.node.execSync',
    kind: 'syntax',
    match: node(['execSync'], { firstOnly: false, extraLangs: ['json', 'bash'] }),
    term: { en: 'execSync', es: 'execSync' },
    short: {
      en: 'Runs a shell command and blocks until it finishes. Code that reaches `execSync` can execute operating-system commands.',
      es: 'Ejecuta un comando de shell y bloquea hasta que termina. El código que llega a `execSync` puede ejecutar comandos del sistema operativo.',
    },
  },
  {
    id: 'syntax.node.execArgv',
    kind: 'syntax',
    match: node(['execArgv'], { firstOnly: false, extraLangs: ['json', 'bash'] }),
    term: { en: 'execArgv', es: 'execArgv' },
    short: {
      en: 'An array of Node CLI flags for a child process, such as `--eval`. If the options object has no own `execArgv`, a lookup can inherit a polluted `Object.prototype.execArgv`.',
      es: 'Un array de flags CLI de Node para un proceso hijo, como `--eval`. Si el objeto options no tiene su propio `execArgv`, una lectura puede heredar un `Object.prototype.execArgv` contaminado.',
    },
  },
  {
    id: 'syntax.node.__dirname',
    kind: 'syntax',
    match: node(['__dirname']),
    term: { en: '__dirname', es: '__dirname' },
    short: {
      en: 'The absolute path of the directory that contains the current module. Lab handlers often pass it as `cwd` so the child starts in the same folder.',
      es: 'La ruta absoluta del directorio que contiene el módulo actual. Los handlers de los labs suelen pasarlo como `cwd` para que el hijo arranque en la misma carpeta.',
    },
  },
];
