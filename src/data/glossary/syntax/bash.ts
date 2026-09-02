import type { GlossaryEntry, GlossaryMatch } from '../types';

function flags(...tokens: string[]): GlossaryMatch {
  return { langs: ['bash'], tokens, firstOnly: false };
}

function cmd(...tokens: string[]): GlossaryMatch {
  return { langs: ['bash'], tokens, firstOnly: true };
}

export const BASH_SYNTAX: GlossaryEntry[] = [
  {
    id: 'syntax.bash.grep',
    kind: 'syntax',
    match: cmd('grep'),
    term: { en: 'grep', es: 'grep' },
    short: {
      en: 'Prints lines that match a pattern. Piped after curl, it filters the response down to the interesting headers or HTML.',
      es: 'Imprime las líneas que coinciden con un patrón. Tras un pipe de curl, filtra la respuesta y deja las cabeceras o el HTML que importan.',
    },
  },
  {
    id: 'syntax.bash.grep.ignore-case',
    kind: 'syntax',
    match: flags('-iE', '-Ei'),
    term: { en: '-iE', es: '-iE' },
    short: {
      en: 'A grep cluster: `-i` makes the match case-insensitive, and `-E` treats the pattern as an extended regex (`set-cookie|csrf` is two alternatives).',
      es: 'Un grupo de grep: `-i` hace la coincidencia insensible a mayúsculas, y `-E` trata el patrón como regex extendida (`set-cookie|csrf` son dos alternativas).',
    },
  },
  {
    id: 'syntax.bash.grep.after-context',
    kind: 'syntax',
    match: flags('grep -A'),
    term: { en: 'grep -A', es: 'grep -A' },
    short: {
      en: 'grep `-A n` prints n lines after each match, so a match on `csrf` can include the surrounding HTML.',
      es: 'grep `-A n` imprime n líneas después de cada coincidencia, así un match de `csrf` puede incluir el HTML de alrededor.',
    },
  },
  {
    id: 'syntax.bash.echo',
    kind: 'syntax',
    match: cmd('echo'),
    term: { en: 'echo', es: 'echo' },
    short: {
      en: 'Writes its arguments to stdout, then a newline. Often used to feed a string into `base64` or another filter.',
      es: 'Escribe sus argumentos en stdout y luego un salto de línea. Suele usarse para pasar una cadena a `base64` u otro filtro.',
    },
  },
  {
    id: 'syntax.bash.echo.no-newline',
    kind: 'syntax',
    match: flags('-n'),
    term: { en: 'echo -n', es: 'echo -n' },
    short: {
      en: 'Tells `echo` not to append a newline. Needed when the next tool (such as `base64`) must see only the payload bytes.',
      es: 'Indica a `echo` que no añada un salto de línea. Hace falta cuando la siguiente herramienta (como `base64`) debe ver solo los bytes del payload.',
    },
  },
  {
    id: 'syntax.bash.cat',
    kind: 'syntax',
    match: cmd('cat'),
    term: { en: 'cat', es: 'cat' },
    short: {
      en: 'Copies stdin to stdout. After a pipe it is a no-op that still forces the previous command to run in a pipeline.',
      es: 'Copia stdin en stdout. Tras un pipe no cambia los datos, pero obliga al comando anterior a ejecutarse en una tubería.',
    },
  },
  {
    id: 'syntax.bash.base64',
    kind: 'syntax',
    match: cmd('base64'),
    term: { en: 'base64', es: 'base64' },
    short: {
      en: 'Encodes or decodes Base64. JWT labs use it to inspect header and payload segments; PHP labs use it to wrap serialized objects.',
      es: 'Codifica o decodifica Base64. En los labs de JWT sirve para inspeccionar header y payload; en los de PHP, para envolver objetos serializados.',
    },
  },
  {
    id: 'syntax.bash.base64.decode',
    kind: 'syntax',
    match: flags('base64 -d'),
    term: { en: 'base64 -d', es: 'base64 -d' },
    short: {
      en: '`base64 -d` decodes Base64 from stdin. JWT segments often need padding (`=`) added first because Base64URL omits it.',
      es: '`base64 -d` decodifica Base64 desde stdin. A los segmentos JWT a menudo hay que añadirles padding (`=`) antes, porque Base64URL lo omite.',
    },
  },
  {
    id: 'syntax.bash.base64.wrap',
    kind: 'syntax',
    match: flags('-w0'),
    term: { en: 'base64 -w0', es: 'base64 -w0' },
    short: {
      en: 'GNU `base64 -w0` wraps at column 0, which disables line wrapping so the encoded payload stays on one line.',
      es: 'GNU `base64 -w0` envuelve en la columna 0, lo que desactiva el salto de línea y deja el payload codificado en una sola línea.',
    },
  },
  {
    id: 'syntax.bash.jq',
    kind: 'syntax',
    match: cmd('jq'),
    term: { en: 'jq', es: 'jq' },
    short: {
      en: 'A JSON processor. `jq .` pretty-prints stdin, which makes decoded JWT headers and JWKS documents readable.',
      es: 'Un procesador de JSON. `jq .` formatea stdin, y así se pueden leer headers JWT decodificados y documentos JWKS.',
    },
  },
  {
    id: 'syntax.bash.head',
    kind: 'syntax',
    match: cmd('head'),
    term: { en: 'head', es: 'head' },
    short: {
      en: 'Prints the first lines of stdin. `head -10` keeps ten lines, enough to see status and `Set-Cookie` without the rest of the body.',
      es: 'Imprime las primeras líneas de stdin. `head -10` deja diez líneas, suficiente para ver el estado y `Set-Cookie` sin el resto del cuerpo.',
    },
  },
];
