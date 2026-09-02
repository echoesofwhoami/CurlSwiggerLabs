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
    term: { en: 'curl', es: 'curl' },
    short: {
      en: 'A command-line HTTP client. It sends the request described by its flags and prints the response, which is why lab writeups use it instead of a browser.',
      es: 'Un cliente HTTP de línea de comandos. Envía la petición que describen sus flags e imprime la respuesta; por eso los writeups lo usan en lugar de un navegador.',
    },
  },
  {
    id: 'syntax.curl.header',
    kind: 'syntax',
    match: flags('--header', '-H'),
    term: { en: '-H / --header', es: '-H / --header' },
    short: {
      en: 'Adds an HTTP header to the request. Write it as `Name: value`, for example `Cookie: session=abc`.',
      es: 'Añade una cabecera HTTP a la petición. Se escribe como `Name: value`, por ejemplo `Cookie: session=abc`.',
    },
  },
  {
    id: 'syntax.curl.data',
    kind: 'syntax',
    match: flags('--data-raw', '--data', '-d'),
    term: { en: '-d / --data / --data-raw', es: '-d / --data / --data-raw' },
    short: {
      en: 'Sends the following string as the request body (curl switches to POST). `--data` treats a leading `@` as a file path; `--data-raw` sends the string unchanged.',
      es: 'Envía la cadena siguiente como cuerpo de la petición (curl pasa a POST). `--data` trata `@` al inicio como ruta de archivo; `--data-raw` envía la cadena tal cual.',
    },
  },
  {
    id: 'syntax.curl.data-binary',
    kind: 'syntax',
    match: flags('--data-binary'),
    term: { en: '--data-binary', es: '--data-binary' },
    short: {
      en: 'Sends the body with almost no extra processing, so newlines and null bytes stay intact. Use it when the payload must match raw HTTP bytes.',
      es: 'Envía el cuerpo casi sin procesarlo, así que saltos de línea y bytes nulos se conservan. Sirve cuando el payload debe coincidir byte a byte con HTTP en bruto.',
    },
  },
  {
    id: 'syntax.curl.data-urlencode',
    kind: 'syntax',
    match: flags('--data-urlencode'),
    term: { en: '--data-urlencode', es: '--data-urlencode' },
    short: {
      en: 'URL-encodes the data before sending it as the body. Use this when the payload has spaces, `&`, or other characters that would break form encoding.',
      es: 'Codifica los datos en URL antes de enviarlos como cuerpo. Úsalo cuando el payload lleva espacios, `&` u otros caracteres que romperían el encoding de formulario.',
    },
  },
  {
    id: 'syntax.curl.silent',
    kind: 'syntax',
    match: flags('--silent', '-s'),
    term: { en: '-s / --silent', es: '-s / --silent' },
    short: {
      en: 'Hides the progress meter and most curl diagnostics. The response body still prints to stdout.',
      es: 'Oculta el medidor de progreso y casi todos los diagnósticos de curl. El cuerpo de la respuesta sigue saliendo por stdout.',
    },
  },
  {
    id: 'syntax.curl.dump-header',
    kind: 'syntax',
    match: flags('--dump-header', '-D'),
    term: { en: '-D / --dump-header', es: '-D / --dump-header' },
    short: {
      en: 'Writes response headers to a file, or to stdout when the path is `-`. Unlike `-i`, the body does not get mixed into that header dump.',
      es: 'Escribe las cabeceras de respuesta en un archivo, o en stdout si la ruta es `-`. A diferencia de `-i`, el cuerpo no se mezcla en ese volcado de cabeceras.',
    },
  },
  {
    id: 'syntax.curl.silent-include',
    kind: 'syntax',
    match: flags('-si'),
    term: { en: '-si', es: '-si' },
    short: {
      en: 'Combines `-s` (hide the progress meter) and `-i` (print response headers before the body) into one cluster.',
      es: 'Combina `-s` (ocultar el medidor de progreso) e `-i` (imprimir las cabeceras de respuesta antes del cuerpo) en un solo grupo.',
    },
  },
  {
    id: 'syntax.curl.include',
    kind: 'syntax',
    match: flags('--include', '-i'),
    term: { en: '-i / --include', es: '-i / --include' },
    short: {
      en: 'Prints response headers before the body. Useful for status lines, `Set-Cookie`, and `Location`.',
      es: 'Imprime las cabeceras de respuesta antes del cuerpo. Sirve para ver la línea de estado, `Set-Cookie` y `Location`.',
    },
  },
  {
    id: 'syntax.curl.insecure',
    kind: 'syntax',
    match: flags('--insecure', '-k'),
    term: { en: '-k / --insecure', es: '-k / --insecure' },
    short: {
      en: 'Skips TLS certificate verification. Lab hosts often use certificates a normal browser would reject.',
      es: 'Omite la verificación del certificado TLS. Los labs suelen usar certificados que un navegador normal rechazaría.',
    },
  },
  {
    id: 'syntax.curl.request',
    kind: 'syntax',
    match: flags('--request', '-X'),
    term: { en: '-X / --request', es: '-X / --request' },
    short: {
      en: 'Sets the HTTP method, such as GET, POST, or PUT. Without it, curl infers GET, or POST when a body flag is present.',
      es: 'Fija el método HTTP, por ejemplo GET, POST o PUT. Sin esta opción, curl asume GET, o POST si hay un flag de cuerpo.',
    },
  },
  {
    id: 'syntax.curl.cookie',
    kind: 'syntax',
    match: flags('--cookie', '-b'),
    term: { en: '-b / --cookie', es: '-b / --cookie' },
    short: {
      en: 'Sends cookies on the request. Accepts `name=value` pairs or a cookie file written earlier with `-c`.',
      es: 'Envía cookies en la petición. Acepta pares `name=value` o un archivo de cookies escrito antes con `-c`.',
    },
  },
  {
    id: 'syntax.curl.cookie-jar',
    kind: 'syntax',
    match: flags('--cookie-jar', '-c'),
    term: { en: '-c / --cookie-jar', es: '-c / --cookie-jar' },
    short: {
      en: 'Writes received `Set-Cookie` values to a file. Pair with `-b` on later requests to replay the session.',
      es: 'Guarda en un archivo las cookies recibidas en `Set-Cookie`. Combínalo con `-b` en peticiones posteriores para reutilizar la sesión.',
    },
  },
  {
    id: 'syntax.curl.location',
    kind: 'syntax',
    match: flags('--location', '-L'),
    term: { en: '-L / --location', es: '-L / --location' },
    short: {
      en: 'Follows `Location` redirects. Without this, curl stops at the 3xx response and does not fetch the next URL.',
      es: 'Sigue las redirecciones `Location`. Sin esta opción, curl se queda en la respuesta 3xx y no pide la URL siguiente.',
    },
  },
  {
    id: 'syntax.curl.http1.1',
    kind: 'syntax',
    match: flags('--http1.1'),
    term: { en: '--http1.1', es: '--http1.1' },
    short: {
      en: 'Forces HTTP/1.1 instead of HTTP/2. Request smuggling labs need HTTP/1 because the attack relies on HTTP/1 framing.',
      es: 'Fuerza HTTP/1.1 en lugar de HTTP/2. Los labs de request smuggling necesitan HTTP/1 porque el ataque depende del framing de HTTP/1.',
    },
  },
  {
    id: 'syntax.curl.path-as-is',
    kind: 'syntax',
    match: flags('--path-as-is'),
    term: { en: '--path-as-is', es: '--path-as-is' },
    short: {
      en: 'Leaves the URL path unchanged, including `../` segments. Without it, curl normalizes the path before sending.',
      es: 'Deja la ruta de la URL tal cual, incluidos los segmentos `../`. Sin esta opción, curl normaliza la ruta antes de enviarla.',
    },
  },
  {
    id: 'syntax.curl.get',
    kind: 'syntax',
    match: flags('--get', '-G'),
    term: { en: '-G / --get', es: '-G / --get' },
    short: {
      en: 'Puts `-d` data in the query string and sends a GET request instead of a POST body.',
      es: 'Coloca los datos de `-d` en la query string y envía un GET en lugar de un cuerpo POST.',
    },
  },
  {
    id: 'syntax.curl.verbose',
    kind: 'syntax',
    match: flags('--verbose', '-v'),
    term: { en: '-v / --verbose', es: '-v / --verbose' },
    short: {
      en: 'Prints the handshake plus request and response headers, including headers curl adds itself.',
      es: 'Imprime el handshake y las cabeceras de petición y respuesta, incluidas las que curl añade por su cuenta.',
    },
  },
  {
    id: 'syntax.curl.user-agent',
    kind: 'syntax',
    match: flags('--user-agent', '-A'),
    term: { en: '-A / --user-agent', es: '-A / --user-agent' },
    short: {
      en: 'Sets the `User-Agent` header. Some applications change behavior based on this string.',
      es: 'Fija la cabecera `User-Agent`. Algunas aplicaciones cambian su comportamiento según esta cadena.',
    },
  },
  {
    id: 'syntax.curl.referer',
    kind: 'syntax',
    match: flags('--referer', '-e'),
    term: { en: '-e / --referer', es: '-e / --referer' },
    short: {
      en: 'Sets the `Referer` header. The curl flag spelling drops one `r` from the English word "referrer".',
      es: 'Fija la cabecera `Referer`. El flag de curl se escribe con una sola `r`, a diferencia de la palabra inglesa "referrer".',
    },
  },
  {
    id: 'syntax.curl.form',
    kind: 'syntax',
    match: flags('--form', '-F'),
    term: { en: '-F / --form', es: '-F / --form' },
    short: {
      en: 'Builds a `multipart/form-data` body, the same format browsers use for file uploads and mixed form fields.',
      es: 'Construye un cuerpo `multipart/form-data`, el mismo formato que usan los navegadores para subir archivos y campos mixtos.',
    },
  },
  {
    id: 'syntax.curl.user',
    kind: 'syntax',
    match: flags('--user', '-u'),
    term: { en: '-u / --user', es: '-u / --user' },
    short: {
      en: 'Sends HTTP Basic credentials as `user:password`. Curl base64-encodes them into an `Authorization` header.',
      es: 'Envía credenciales HTTP Basic como `user:password`. Curl las codifica en base64 dentro de una cabecera `Authorization`.',
    },
  },
  {
    id: 'syntax.curl.output',
    kind: 'syntax',
    match: flags('--output', '-o'),
    term: { en: '-o / --output', es: '-o / --output' },
    short: {
      en: 'Writes the response body to a file instead of stdout. Headers from `-i` still go to the terminal.',
      es: 'Escribe el cuerpo de la respuesta en un archivo en lugar de stdout. Las cabeceras de `-i` siguen saliendo en la terminal.',
    },
  },
  {
    id: 'syntax.curl.max-redirs',
    kind: 'syntax',
    match: flags('--max-redirs'),
    term: { en: '--max-redirs', es: '--max-redirs' },
    short: {
      en: 'Caps how many `-L` redirects curl will follow. It stops infinite redirect loops.',
      es: 'Limita cuántas redirecciones `-L` seguirá curl. Evita bucles infinitos de redirección.',
    },
  },
];
