import type { CodeLang, GlossaryEntry, GlossaryMatch } from '../types'

function http(tokens: string[], extraLangs: CodeLang[] = []): GlossaryMatch {
  return { langs: ['http', ...extraLangs], tokens }
}

export const HTTP_SYNTAX: GlossaryEntry[] = [
  {
    id: 'syntax.http.GET',
    kind: 'syntax',
    match: http(['GET'], ['python', 'javascript', 'bash']),
    term: { en: 'GET' },
    short: {
      en: 'Requests a resource without a body in typical use. Query data goes in the URL; the request should not change server state.',
    },
  },
  {
    id: 'syntax.http.POST',
    kind: 'syntax',
    match: http(['POST'], ['python', 'javascript', 'bash']),
    term: { en: 'POST' },
    short: {
      en: 'Sends a body to the server, often to submit a form or trigger an action. Curl uses POST automatically when `-d` is set.',
    },
  },
  {
    id: 'syntax.http.PUT',
    kind: 'syntax',
    match: http(['PUT']),
    term: { en: 'PUT' },
    short: {
      en: 'Replaces the target resource with the request body. Labs sometimes use it for file upload or overwrite endpoints.',
    },
  },
  {
    id: 'syntax.http.PATCH',
    kind: 'syntax',
    match: http(['PATCH']),
    term: { en: 'PATCH' },
    short: {
      en: 'Applies a partial update to the resource. Unlike PUT, it is not meant to replace the whole object.',
    },
  },
  {
    id: 'syntax.http.DELETE',
    kind: 'syntax',
    match: http(['DELETE']),
    term: { en: 'DELETE' },
    short: {
      en: 'Asks the server to remove the target resource. The body is usually empty.',
    },
  },
  {
    id: 'syntax.http.Host',
    kind: 'syntax',
    match: http(['Host'], ['python', 'bash']),
    term: { en: 'Host' },
    short: {
      en: 'Names the virtual host the client wants. Required on HTTP/1.1; a mismatch can send the request to the wrong site.',
    },
  },
  {
    id: 'syntax.http.Set-Cookie',
    kind: 'syntax',
    match: http(['Set-Cookie', 'set-cookie'], ['bash']),
    term: { en: 'Set-Cookie' },
    short: {
      en: 'The response header that tells the browser to store a cookie. Attributes after the `name=value` pair (such as `HttpOnly` or `Secure`) restrict how that cookie is used.',
    },
  },
  {
    id: 'syntax.http.Cookie',
    kind: 'syntax',
    match: http(['Cookie'], ['bash']),
    term: { en: 'Cookie' },
    short: {
      en: 'Sends stored cookies to the server as `name=value` pairs separated by `; `. Session tokens usually travel here.',
    },
  },
  {
    id: 'syntax.http.Location',
    kind: 'syntax',
    match: http(['Location', 'location']),
    term: { en: 'Location' },
    short: {
      en: 'On a 3xx response, tells the client where to go next. Open-redirection bugs often take this URL from user input.',
    },
  },
  {
    id: 'syntax.http.Authorization',
    kind: 'syntax',
    match: http(['Authorization']),
    term: { en: 'Authorization' },
    short: {
      en: 'Carries credentials, such as `Bearer <jwt>` or `Basic <base64>`. The scheme word before the value selects how the server parses it.',
    },
  },
  {
    id: 'syntax.http.Content-Type',
    kind: 'syntax',
    match: http(['Content-Type'], ['bash', 'javascript', 'python']),
    term: { en: 'Content-Type' },
    short: {
      en: 'Describes the body\'s media type, such as `application/json` or `application/x-www-form-urlencoded`. The server uses it to parse the body.',
    },
  },
  {
    id: 'syntax.http.Connection',
    kind: 'syntax',
    match: http(['Connection']),
    term: { en: 'Connection' },
    short: {
      en: 'Tells the peer whether to keep the TCP connection open after this message. `close` means the sender will hang up; HTTP/1.1 otherwise defaults to keep-alive.',
    },
  },
  {
    id: 'syntax.http.X-Ignore',
    kind: 'syntax',
    match: http(['X-Ignore'], ['bash', 'python']),
    term: { en: 'X-Ignore' },
    short: {
      en: 'A dummy header used so leftover bytes (or a smuggled request line) become a header the back-end can ignore instead of a second method token.',
    },
  },
]
