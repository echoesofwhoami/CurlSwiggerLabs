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
    term: { en: 'grep' },
    short: {
      en: 'Prints lines that match a pattern. Piped after curl, it filters the response down to the interesting headers or HTML.',
    },
  },
  {
    id: 'syntax.bash.grep.ignore-case',
    kind: 'syntax',
    match: flags('-iE', '-Ei'),
    term: { en: '-iE' },
    short: {
      en: 'A grep cluster: `-i` makes the match case-insensitive, and `-E` treats the pattern as an extended regex (`set-cookie|csrf` is two alternatives).',
    },
  },
  {
    id: 'syntax.bash.grep.after-context',
    kind: 'syntax',
    match: flags('grep -A'),
    term: { en: 'grep -A' },
    short: {
      en: 'grep `-A n` prints n lines after each match, so a match on `csrf` can include the surrounding HTML.',
    },
  },
  {
    id: 'syntax.bash.echo',
    kind: 'syntax',
    match: cmd('echo'),
    term: { en: 'echo' },
    short: {
      en: 'Writes its arguments to stdout, then a newline. Often used to feed a string into `base64` or another filter.',
    },
  },
  {
    id: 'syntax.bash.echo.no-newline',
    kind: 'syntax',
    match: flags('-n'),
    term: { en: 'echo -n' },
    short: {
      en: 'Tells `echo` not to append a newline. Needed when the next tool (such as `base64`) must see only the payload bytes.',
    },
  },
  {
    id: 'syntax.bash.cat',
    kind: 'syntax',
    match: cmd('cat'),
    term: { en: 'cat' },
    short: {
      en: 'Copies stdin to stdout. After a pipe it is a no-op that still forces the previous command to run in a pipeline.',
    },
  },
  {
    id: 'syntax.bash.base64',
    kind: 'syntax',
    match: cmd('base64'),
    term: { en: 'base64' },
    short: {
      en: 'Encodes or decodes Base64. JWT labs use it to inspect header and payload segments; PHP labs use it to wrap serialized objects.',
    },
  },
  {
    id: 'syntax.bash.base64.decode',
    kind: 'syntax',
    match: flags('base64 -d'),
    term: { en: 'base64 -d' },
    short: {
      en: '`base64 -d` decodes Base64 from stdin. JWT segments often need padding (`=`) added first because Base64URL omits it.',
    },
  },
  {
    id: 'syntax.bash.base64.wrap',
    kind: 'syntax',
    match: flags('-w0'),
    term: { en: 'base64 -w0' },
    short: {
      en: 'GNU `base64 -w0` wraps at column 0, which disables line wrapping so the encoded payload stays on one line.',
    },
  },
  {
    id: 'syntax.bash.jq',
    kind: 'syntax',
    match: cmd('jq'),
    term: { en: 'jq' },
    short: {
      en: 'A JSON processor. `jq .` pretty-prints stdin, which makes decoded JWT headers and JWKS documents readable.',
    },
  },
  {
    id: 'syntax.bash.head',
    kind: 'syntax',
    match: cmd('head'),
    term: { en: 'head' },
    short: {
      en: 'Prints the first lines of stdin. `head -10` keeps ten lines, enough to see status and `Set-Cookie` without the rest of the body.',
    },
  },
];
