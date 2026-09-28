import type { GlossaryEntry, GlossaryMatch } from '../types';

function flags(...tokens: string[]): GlossaryMatch {
  return { langs: ['bash'], tokens, firstOnly: false };
}

function cmd(...tokens: string[]): GlossaryMatch {
  return { langs: ['bash'], tokens, firstOnly: true };
}

export const CURL_SYNTAX: GlossaryEntry[] = [
  {
    id: 'syntax.curl.curl',
    kind: 'syntax',
    match: cmd('curl'),
    term: { en: 'curl' },
    short: {
      en: 'A command-line HTTP client. It sends the request described by its flags and prints the response, which is why lab writeups use it instead of a browser.',
    },
  },
  {
    id: 'syntax.curl.header',
    kind: 'syntax',
    match: flags('--header', '-H'),
    term: { en: '-H / --header' },
    short: {
      en: 'Adds an HTTP header to the request. Write it as `Name: value`, for example `Cookie: session=abc`.',
    },
  },
  {
    id: 'syntax.curl.data',
    kind: 'syntax',
    match: flags('--data-raw', '--data', '-d'),
    term: { en: '-d / --data / --data-raw' },
    short: {
      en: 'Sends the following string as the request body (curl switches to POST). `--data` treats a leading `@` as a file path; `--data-raw` sends the string unchanged.',
    },
  },
  {
    id: 'syntax.curl.data-binary',
    kind: 'syntax',
    match: flags('--data-binary'),
    term: { en: '--data-binary' },
    short: {
      en: 'Sends the body with almost no extra processing, so newlines and null bytes stay intact. Use it when the payload must match raw HTTP bytes.',
    },
  },
  {
    id: 'syntax.curl.data-urlencode',
    kind: 'syntax',
    match: flags('--data-urlencode'),
    term: { en: '--data-urlencode' },
    short: {
      en: 'URL-encodes the data before sending it as the body. Use this when the payload has spaces, `&`, or other characters that would break form encoding.',
    },
  },
  {
    id: 'syntax.curl.silent',
    kind: 'syntax',
    match: flags('--silent', '-s'),
    term: { en: '-s / --silent' },
    short: {
      en: 'Hides the progress meter and most curl diagnostics. The response body still prints to stdout.',
    },
  },
  {
    id: 'syntax.curl.dump-header',
    kind: 'syntax',
    match: flags('--dump-header', '-D'),
    term: { en: '-D / --dump-header' },
    short: {
      en: 'Writes response headers to a file, or to stdout when the path is `-`. Unlike `-i`, the body does not get mixed into that header dump.',
    },
  },
  {
    id: 'syntax.curl.silent-include',
    kind: 'syntax',
    match: flags('-si'),
    term: { en: '-si' },
    short: {
      en: 'Combines `-s` (hide the progress meter) and `-i` (print response headers before the body) into one cluster.',
    },
  },
  {
    id: 'syntax.curl.include',
    kind: 'syntax',
    match: flags('--include', '-i'),
    term: { en: '-i / --include' },
    short: {
      en: 'Prints response headers before the body. Useful for status lines, `Set-Cookie`, and `Location`.',
    },
  },
  {
    id: 'syntax.curl.insecure',
    kind: 'syntax',
    match: flags('--insecure', '-k'),
    term: { en: '-k / --insecure' },
    short: {
      en: 'Skips TLS certificate verification. Lab hosts often use certificates a normal browser would reject.',
    },
  },
  {
    id: 'syntax.curl.request',
    kind: 'syntax',
    match: flags('--request', '-X'),
    term: { en: '-X / --request' },
    short: {
      en: 'Sets the HTTP method, such as GET, POST, or PUT. Without it, curl infers GET, or POST when a body flag is present.',
    },
  },
  {
    id: 'syntax.curl.cookie',
    kind: 'syntax',
    match: flags('--cookie', '-b'),
    term: { en: '-b / --cookie' },
    short: {
      en: 'Sends cookies on the request. Accepts `name=value` pairs or a cookie file written earlier with `-c`.',
    },
  },
  {
    id: 'syntax.curl.cookie-jar',
    kind: 'syntax',
    match: flags('--cookie-jar', '-c'),
    term: { en: '-c / --cookie-jar' },
    short: {
      en: 'Writes received `Set-Cookie` values to a file. Pair with `-b` on later requests to replay the session.',
    },
  },
  {
    id: 'syntax.curl.location',
    kind: 'syntax',
    match: flags('--location', '-L'),
    term: { en: '-L / --location' },
    short: {
      en: 'Follows `Location` redirects. Without this, curl stops at the 3xx response and does not fetch the next URL.',
    },
  },
  {
    id: 'syntax.curl.http1.1',
    kind: 'syntax',
    match: flags('--http1.1'),
    term: { en: '--http1.1' },
    short: {
      en: 'Forces HTTP/1.1 instead of HTTP/2. Request smuggling labs need HTTP/1 because the attack relies on HTTP/1 framing.',
    },
  },
  {
    id: 'syntax.curl.path-as-is',
    kind: 'syntax',
    match: flags('--path-as-is'),
    term: { en: '--path-as-is' },
    short: {
      en: 'Leaves the URL path unchanged, including `../` segments. Without it, curl normalizes the path before sending.',
    },
  },
  {
    id: 'syntax.curl.get',
    kind: 'syntax',
    match: flags('--get', '-G'),
    term: { en: '-G / --get' },
    short: {
      en: 'Puts `-d` data in the query string and sends a GET request instead of a POST body.',
    },
  },
  {
    id: 'syntax.curl.verbose',
    kind: 'syntax',
    match: flags('--verbose', '-v'),
    term: { en: '-v / --verbose' },
    short: {
      en: 'Prints the handshake plus request and response headers, including headers curl adds itself.',
    },
  },
  {
    id: 'syntax.curl.user-agent',
    kind: 'syntax',
    match: flags('--user-agent', '-A'),
    term: { en: '-A / --user-agent' },
    short: {
      en: 'Sets the `User-Agent` header. Some applications change behavior based on this string.',
    },
  },
  {
    id: 'syntax.curl.referer',
    kind: 'syntax',
    match: flags('--referer', '-e'),
    term: { en: '-e / --referer' },
    short: {
      en: 'Sets the `Referer` header. The curl flag spelling drops one `r` from the English word "referrer".',
    },
  },
  {
    id: 'syntax.curl.form',
    kind: 'syntax',
    match: flags('--form', '-F'),
    term: { en: '-F / --form' },
    short: {
      en: 'Builds a `multipart/form-data` body, the same format browsers use for file uploads and mixed form fields.',
    },
  },
  {
    id: 'syntax.curl.user',
    kind: 'syntax',
    match: flags('--user', '-u'),
    term: { en: '-u / --user' },
    short: {
      en: 'Sends HTTP Basic credentials as `user:password`. Curl base64-encodes them into an `Authorization` header.',
    },
  },
  {
    id: 'syntax.curl.output',
    kind: 'syntax',
    match: flags('--output', '-o'),
    term: { en: '-o / --output' },
    short: {
      en: 'Writes the response body to a file instead of stdout. Headers from `-i` still go to the terminal.',
    },
  },
  {
    id: 'syntax.curl.max-redirs',
    kind: 'syntax',
    match: flags('--max-redirs'),
    term: { en: '--max-redirs' },
    short: {
      en: 'Caps how many `-L` redirects curl will follow. It stops infinite redirect loops.',
    },
  },
];
