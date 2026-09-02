import type { CodeLang, GlossaryEntry, GlossaryMatch } from '../types';

function http(tokens: string[], extraLangs: CodeLang[] = []): GlossaryMatch {
  return { langs: ['http', ...extraLangs], tokens };
}

export const HTTP_SYNTAX: GlossaryEntry[] = [
  {
    id: 'syntax.http.GET',
    kind: 'syntax',
    match: http(['GET'], ['python', 'javascript', 'bash']),
    term: { en: 'GET', es: 'GET' },
    short: {
      en: 'Requests a resource without a body in typical use. Query data goes in the URL; the request should not change server state.',
      es: 'Pide un recurso, normalmente sin cuerpo. Los datos de consulta van en la URL; la petición no debería cambiar el estado del servidor.',
    },
  },
  {
    id: 'syntax.http.POST',
    kind: 'syntax',
    match: http(['POST'], ['python', 'javascript', 'bash']),
    term: { en: 'POST', es: 'POST' },
    short: {
      en: 'Sends a body to the server, often to submit a form or trigger an action. Curl uses POST automatically when `-d` is set.',
      es: 'Envía un cuerpo al servidor, a menudo para enviar un formulario o disparar una acción. Curl usa POST solo con poner `-d`.',
    },
  },
  {
    id: 'syntax.http.PUT',
    kind: 'syntax',
    match: http(['PUT']),
    term: { en: 'PUT', es: 'PUT' },
    short: {
      en: 'Replaces the target resource with the request body. Labs sometimes use it for file upload or overwrite endpoints.',
      es: 'Sustituye el recurso de destino por el cuerpo de la petición. En los labs a veces aparece en endpoints de subida o sobrescritura de archivos.',
    },
  },
  {
    id: 'syntax.http.PATCH',
    kind: 'syntax',
    match: http(['PATCH']),
    term: { en: 'PATCH', es: 'PATCH' },
    short: {
      en: 'Applies a partial update to the resource. Unlike PUT, it is not meant to replace the whole object.',
      es: 'Aplica una actualización parcial al recurso. A diferencia de PUT, no pretende reemplazar el objeto entero.',
    },
  },
  {
    id: 'syntax.http.DELETE',
    kind: 'syntax',
    match: http(['DELETE']),
    term: { en: 'DELETE', es: 'DELETE' },
    short: {
      en: 'Asks the server to remove the target resource. The body is usually empty.',
      es: 'Pide al servidor que elimine el recurso de destino. El cuerpo suele ir vacío.',
    },
  },
  {
    id: 'syntax.http.Host',
    kind: 'syntax',
    match: http(['Host'], ['python', 'bash']),
    term: { en: 'Host', es: 'Host' },
    short: {
      en: 'Names the virtual host the client wants. Required on HTTP/1.1; a mismatch can send the request to the wrong site.',
      es: 'Indica el host virtual que quiere el cliente. Es obligatorio en HTTP/1.1; un valor incorrecto puede enviar la petición al sitio equivocado.',
    },
  },
  {
    id: 'syntax.http.Set-Cookie',
    kind: 'syntax',
    match: http(['Set-Cookie', 'set-cookie'], ['bash']),
    term: { en: 'Set-Cookie', es: 'Set-Cookie' },
    short: {
      en: 'The response header that tells the browser to store a cookie. Attributes after the `name=value` pair (such as `HttpOnly` or `Secure`) restrict how that cookie is used.',
      es: 'La cabecera de respuesta que indica al navegador que guarde una cookie. Los atributos tras el par `name=value` (como `HttpOnly` o `Secure`) restringen cómo se usa esa cookie.',
    },
  },
  {
    id: 'syntax.http.Cookie',
    kind: 'syntax',
    match: http(['Cookie'], ['bash']),
    term: { en: 'Cookie', es: 'Cookie' },
    short: {
      en: 'Sends stored cookies to the server as `name=value` pairs separated by `; `. Session tokens usually travel here.',
      es: 'Envía al servidor las cookies guardadas, como pares `name=value` separados por `; `. Los tokens de sesión suelen ir aquí.',
    },
  },
  {
    id: 'syntax.http.Location',
    kind: 'syntax',
    match: http(['Location', 'location']),
    term: { en: 'Location', es: 'Location' },
    short: {
      en: 'On a 3xx response, tells the client where to go next. Open-redirection bugs often take this URL from user input.',
      es: 'En una respuesta 3xx, indica al cliente a dónde ir después. Las fallas de open redirection suelen tomar esta URL de entrada del usuario.',
    },
  },
  {
    id: 'syntax.http.Authorization',
    kind: 'syntax',
    match: http(['Authorization']),
    term: { en: 'Authorization', es: 'Authorization' },
    short: {
      en: 'Carries credentials, such as `Bearer <jwt>` or `Basic <base64>`. The scheme word before the value selects how the server parses it.',
      es: 'Transporta credenciales, como `Bearer <jwt>` o `Basic <base64>`. La palabra del esquema antes del valor indica cómo las interpreta el servidor.',
    },
  },
  {
    id: 'syntax.http.Content-Type',
    kind: 'syntax',
    match: http(['Content-Type'], ['bash', 'javascript', 'python']),
    term: { en: 'Content-Type', es: 'Content-Type' },
    short: {
      en: 'Describes the body\'s media type, such as `application/json` or `application/x-www-form-urlencoded`. The server uses it to parse the body.',
      es: 'Describe el tipo de medio del cuerpo, por ejemplo `application/json` o `application/x-www-form-urlencoded`. El servidor lo usa para interpretar el cuerpo.',
    },
  },
  {
    id: 'syntax.http.Connection',
    kind: 'syntax',
    match: http(['Connection']),
    term: { en: 'Connection', es: 'Connection' },
    short: {
      en: 'Tells the peer whether to keep the TCP connection open after this message. `close` means the sender will hang up; HTTP/1.1 otherwise defaults to keep-alive.',
      es: 'Indica al otro extremo si debe mantener abierta la conexión TCP tras este mensaje. `close` significa que quien envía colgará; HTTP/1.1, si no, asume keep-alive.',
    },
  },
  {
    id: 'syntax.http.X-Ignore',
    kind: 'syntax',
    match: http(['X-Ignore'], ['bash', 'python']),
    term: { en: 'X-Ignore', es: 'X-Ignore' },
    short: {
      en: 'A dummy header used so leftover bytes (or a smuggled request line) become a header the back-end can ignore instead of a second method token.',
      es: 'Una cabecera ficticia para que los bytes sobrantes (o una línea de petición de contrabando) pasen a ser una cabecera que el back-end puede ignorar, y no un segundo método.',
    },
  },
];
