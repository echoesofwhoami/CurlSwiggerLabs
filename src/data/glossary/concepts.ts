import type { GlossaryEntry } from './types';

export const CONCEPTS: GlossaryEntry[] = [
  {
    id: 'concept.innerHTML',
    kind: 'concept',
    match: {
      langs: ['javascript', 'html'],
      tokens: ['innerHTML'],
      firstOnly: false,
    },
    term: { en: 'innerHTML', es: 'innerHTML' },
    short: {
      en: 'Assigning to `innerHTML` makes the browser parse the string as HTML. Tags and event handlers in that string can run as script, which is why it is a classic DOM XSS sink.',
      es: 'Asignar a `innerHTML` hace que el navegador interprete la cadena como HTML. Etiquetas y manejadores de eventos en esa cadena pueden ejecutarse como script; por eso es un sink clásico de DOM XSS.',
    },
    partial: 'dom-sink',
    refs: [
      {
        title: 'MDN: Element.innerHTML',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML',
      },
      {
        title: 'PortSwigger: DOM-based XSS',
        url: 'https://portswigger.net/web-security/cross-site-scripting/dom-based',
      },
    ],
  },
  {
    id: 'concept.content-length',
    kind: 'concept',
    match: {
      langs: ['http', 'bash', 'python'],
      tokens: ['Content-Length'],
      firstOnly: false,
    },
    term: { en: 'Content-Length', es: 'Content-Length' },
    short: {
      en: '`Content-Length` is the body size in bytes. Front-end and back-end servers that disagree on this value can be tricked into HTTP request smuggling.',
      es: '`Content-Length` es el tamaño del cuerpo en bytes. Si el front-end y el back-end no coinciden en este valor, se les puede engañar para hacer HTTP request smuggling.',
    },
    refs: [
      {
        title: 'RFC 9110: Content-Length',
        url: 'https://www.rfc-editor.org/rfc/rfc9110.html#field.content-length',
      },
      {
        title: 'PortSwigger: HTTP request smuggling',
        url: 'https://portswigger.net/web-security/request-smuggling',
      },
    ],
  },
  {
    id: 'concept.transfer-encoding',
    kind: 'concept',
    match: {
      langs: ['http', 'bash', 'python'],
      tokens: ['Transfer-Encoding'],
      firstOnly: false,
    },
    term: { en: 'Transfer-Encoding', es: 'Transfer-Encoding' },
    short: {
      en: '`Transfer-Encoding` says how the body is framed on the wire, most often `chunked`. HTTP/1.1 can use this instead of `Content-Length`.',
      es: '`Transfer-Encoding` indica cómo va enmarcado el cuerpo en el cable, casi siempre `chunked`. HTTP/1.1 puede usarlo en lugar de `Content-Length`.',
    },
    refs: [
      {
        title: 'RFC 9112: Transfer-Encoding',
        url: 'https://www.rfc-editor.org/rfc/rfc9112.html#field.transfer-encoding',
      },
    ],
  },
  {
    id: 'concept.chunked-encoding',
    kind: 'concept',
    match: {
      langs: ['http', 'bash'],
      tokens: ['chunked'],
      firstOnly: false,
    },
    term: { en: 'Chunked transfer encoding', es: 'Transferencia chunked' },
    short: {
      en: 'Chunked transfer coding sends the body in sized pieces, ending with a zero-length chunk. Each chunk starts with its size in hex, then the bytes.',
      es: 'La transferencia chunked envía el cuerpo en trozos con tamaño, y termina con un chunk de longitud cero. Cada chunk empieza con su tamaño en hexadecimal y luego los bytes.',
    },
    refs: [
      {
        title: 'RFC 9112: Chunked transfer coding',
        url: 'https://www.rfc-editor.org/rfc/rfc9112.html#chunked.encoding',
      },
    ],
  },
  {
    id: 'concept.jwt',
    kind: 'concept',
    match: {
      langs: ['javascript', 'python', 'bash', 'http'],
      tokens: ['JWT', 'jwt'],
      firstOnly: false,
    },
    term: { en: 'JWT', es: 'JWT' },
    short: {
      en: 'A JWT is three Base64URL parts (header, payload, signature) joined by dots. The signature is supposed to stop anyone from changing the claims.',
      es: 'Un JWT son tres partes en Base64URL (header, payload, firma) unidas por puntos. La firma debería impedir que alguien altere las claims.',
    },
    partial: 'whats-jwt',
    refs: [
      {
        title: 'RFC 7519: JSON Web Token',
        url: 'https://www.rfc-editor.org/rfc/rfc7519.html',
      },
      {
        title: 'PortSwigger: JWT attacks',
        url: 'https://portswigger.net/web-security/jwt',
      },
    ],
  },
  {
    id: 'concept.cl-te',
    kind: 'concept',
    term: { en: 'CL.TE desync', es: 'Desincronización CL.TE' },
    short: {
      en: 'In a CL.TE desync, the front-end uses `Content-Length` and the back-end uses `Transfer-Encoding`. Hidden bytes after the CL body become the start of the next back-end request.',
      es: 'En una desincronización CL.TE, el front-end usa `Content-Length` y el back-end usa `Transfer-Encoding`. Los bytes ocultos tras el cuerpo CL pasan a ser el inicio de la siguiente petición en el back-end.',
    },
    partial: 'cl-te-differential-responses',
    refs: [
      {
        title: 'PortSwigger: Confirming CL.TE with differential responses',
        url: 'https://portswigger.net/web-security/request-smuggling/finding#confirming-clte-vulnerabilities-using-differential-responses',
      },
      {
        title: 'PortSwigger: HTTP request smuggling',
        url: 'https://portswigger.net/web-security/request-smuggling',
      },
    ],
  },
  {
    id: 'concept.http-request-smuggling',
    kind: 'concept',
    term: { en: 'HTTP request smuggling', es: 'HTTP request smuggling' },
    short: {
      en: 'HTTP request smuggling confuses a front-end and back-end about where one request ends. The attacker then prepends a hidden request that other users, or the back-end itself, will process.',
      es: 'HTTP request smuggling confunde a un front-end y un back-end sobre dónde termina una petición. El atacante antepone entonces una petición oculta que procesarán otros usuarios o el propio back-end.',
    },
    partial: 'http-request-smuggling',
    refs: [
      {
        title: 'PortSwigger: HTTP request smuggling',
        url: 'https://portswigger.net/web-security/request-smuggling',
      },
      {
        title: 'OWASP: HTTP Request Smuggling',
        url: 'https://owasp.org/www-community/attacks/HTTP_Request_Smuggling',
      },
    ],
  },
  {
    id: 'concept.dom-clobbering',
    kind: 'concept',
    term: { en: 'DOM clobbering', es: 'DOM clobbering' },
    short: {
      en: 'DOM clobbering uses HTML elements with `id` or `name` to overwrite JavaScript globals the page later reads. A crafted element can make `window.someConfig` look like a real object.',
      es: 'DOM clobbering usa elementos HTML con `id` o `name` para pisar globales de JavaScript que la página lee después. Un elemento manipulado puede hacer que `window.someConfig` parezca un objeto real.',
    },
    partial: 'dom-clobbering',
    refs: [
      {
        title: 'PortSwigger: DOM clobbering',
        url: 'https://portswigger.net/web-security/dom-based/dom-clobbering',
      },
      {
        title: 'PortSwigger: DOM-based vulnerabilities',
        url: 'https://portswigger.net/web-security/dom-based',
      },
    ],
  },
  {
    id: 'concept.dom-sink',
    kind: 'concept',
    term: { en: 'DOM sink', es: 'Sink del DOM' },
    short: {
      en: 'A DOM sink is where client-side code hands data to a dangerous browser API. If attacker-controlled input reaches a sink such as `innerHTML` or `eval`, the result is DOM XSS.',
      es: 'Un sink del DOM es el punto donde el código del cliente entrega datos a una API peligrosa del navegador. Si entra input controlado por un atacante a un sink como `innerHTML` o `eval`, el resultado es DOM XSS.',
    },
    partial: 'dom-sink',
    refs: [
      {
        title: 'PortSwigger: DOM-based XSS',
        url: 'https://portswigger.net/web-security/cross-site-scripting/dom-based',
      },
      {
        title: 'MDN: Element.innerHTML',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML',
      },
    ],
  },
  {
    id: 'concept.dom',
    kind: 'concept',
    term: { en: 'DOM', es: 'DOM' },
    short: {
      en: 'The DOM is the browser\'s live tree of the page: elements, attributes, and text. JavaScript reads and changes that tree, not the original HTML source.',
      es: 'El DOM es el árbol en vivo de la página en el navegador: elementos, atributos y texto. JavaScript lee y modifica ese árbol, no el HTML original.',
    },
    partial: 'dom',
    refs: [
      {
        title: 'MDN: Document Object Model',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model',
      },
      {
        title: 'MDN: Introduction to the DOM',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction',
      },
    ],
  },
  {
    id: 'concept.xss',
    kind: 'concept',
    term: { en: 'Cross-site scripting (XSS)', es: 'Cross-site scripting (XSS)' },
    short: {
      en: 'Cross-site scripting injects script into a page that other users\' browsers will run. The attacker then acts in the victim\'s session: steal cookies, rewrite the DOM, or call APIs as that user.',
      es: 'Cross-site scripting inyecta script en una página que ejecutarán los navegadores de otros usuarios. El atacante actúa entonces en la sesión de la víctima: robar cookies, reescribir el DOM o llamar APIs como ese usuario.',
    },
    refs: [
      {
        title: 'PortSwigger: Cross-site scripting',
        url: 'https://portswigger.net/web-security/cross-site-scripting',
      },
      {
        title: 'OWASP: Cross Site Scripting (XSS)',
        url: 'https://owasp.org/www-community/attacks/xss/',
      },
    ],
  },
  {
    id: 'concept.ssrf',
    kind: 'concept',
    term: { en: 'Server-side request forgery (SSRF)', es: 'Server-side request forgery (SSRF)' },
    short: {
      en: 'Server-side request forgery makes the application fetch a URL the attacker chooses. That often reaches internal hosts the attacker could not hit directly.',
      es: 'Server-side request forgery hace que la aplicación pida una URL elegida por el atacante. Suele alcanzar hosts internos a los que el atacante no podría llegar en directo.',
    },
    partial: 'ssrf',
    refs: [
      {
        title: 'PortSwigger: Server-side request forgery',
        url: 'https://portswigger.net/web-security/ssrf',
      },
      {
        title: 'OWASP: Server Side Request Forgery',
        url: 'https://owasp.org/www-community/attacks/Server_Side_Request_Forgery',
      },
    ],
  },
  {
    id: 'concept.csrf',
    kind: 'concept',
    term: { en: 'Cross-site request forgery (CSRF)', es: 'Cross-site request forgery (CSRF)' },
    short: {
      en: 'Cross-site request forgery tricks a logged-in browser into sending a state-changing request the user did not mean to make. The site sees a real session cookie and treats the action as the user\'s.',
      es: 'Cross-site request forgery engaña a un navegador con sesión iniciada para que envíe una petición que cambia estado y el usuario no quería hacer. El sitio ve una cookie de sesión real y trata la acción como si fuera de esa persona.',
    },
    refs: [
      {
        title: 'PortSwigger: Cross-site request forgery',
        url: 'https://portswigger.net/web-security/csrf',
      },
      {
        title: 'OWASP: Cross Site Request Forgery (CSRF)',
        url: 'https://owasp.org/www-community/attacks/csrf',
      },
    ],
  },
  {
    id: 'concept.path-traversal',
    kind: 'concept',
    match: {
      langs: ['bash', 'http', 'python', 'javascript'],
      tokens: ['../', '..\\'],
      firstOnly: false,
    },
    term: { en: 'Path traversal', es: 'Path traversal' },
    short: {
      en: 'Path traversal uses `../` (or `..\\` on Windows) to climb out of an intended directory. If the application concatenates that into a file path, the attacker can read or write files elsewhere on the server.',
      es: 'Path traversal usa `../` (o `..\\` en Windows) para subir de un directorio previsto. Si la aplicación concatena eso en una ruta de archivo, el atacante puede leer o escribir archivos en otras partes del servidor.',
    },
    refs: [
      {
        title: 'PortSwigger: Directory traversal',
        url: 'https://portswigger.net/web-security/file-path-traversal',
      },
      {
        title: 'OWASP: Path Traversal',
        url: 'https://owasp.org/www-community/attacks/Path_Traversal',
      },
    ],
  },
  {
    id: 'concept.prototype-pollution',
    kind: 'concept',
    term: { en: 'Prototype pollution', es: 'Prototype pollution' },
    short: {
      en: 'Prototype pollution sets properties on a prototype that many objects inherit, often `Object.prototype`. Later checks like `obj.isAdmin` then see the attacker\'s value even on objects that never defined it.',
      es: 'Prototype pollution asigna propiedades en un prototipo del que heredan muchos objetos, a menudo `Object.prototype`. Comprobaciones posteriores como `obj.isAdmin` ven entonces el valor del atacante incluso en objetos que nunca lo definieron.',
    },
    partial: 'prototype-pollution',
    refs: [
      {
        title: 'PortSwigger: Prototype pollution',
        url: 'https://portswigger.net/web-security/prototype-pollution',
      },
      {
        title: 'OWASP: Prototype Pollution Prevention',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html',
      },
    ],
  },
  {
    id: 'concept.php-deserialization',
    kind: 'concept',
    match: {
      langs: ['php', 'bash'],
      tokens: ['unserialize'],
      firstOnly: false,
    },
    term: { en: 'PHP deserialization', es: 'Deserialización en PHP' },
    short: {
      en: 'PHP `unserialize` rebuilds objects from a string. If that string is attacker-controlled, magic methods on those objects can run with dangerous arguments (object injection).',
      es: '`unserialize` de PHP reconstruye objetos a partir de una cadena. Si esa cadena la controla un atacante, los magic methods de esos objetos pueden ejecutarse con argumentos peligrosos (object injection).',
    },
    partial: 'php-serialization',
    refs: [
      {
        title: 'PortSwigger: Insecure deserialization',
        url: 'https://portswigger.net/web-security/deserialization',
      },
      {
        title: 'OWASP: PHP Object Injection',
        url: 'https://owasp.org/www-community/vulnerabilities/PHP_Object_Injection',
      },
      {
        title: 'PHP: unserialize',
        url: 'https://www.php.net/manual/en/function.unserialize.php',
      },
    ],
  },
  {
    id: 'concept.oauth',
    kind: 'concept',
    term: { en: 'OAuth 2.0', es: 'OAuth 2.0' },
    short: {
      en: 'OAuth 2.0 lets an application obtain limited access to a user\'s account without the password. The dangerous part in labs is usually a redirect URI the provider does not lock down.',
      es: 'OAuth 2.0 permite que una aplicación obtenga acceso limitado a la cuenta de un usuario sin la contraseña. En los labs, lo peligroso suele ser una redirect URI que el proveedor no restringe.',
    },
    partial: 'oauth-2-basics',
    refs: [
      {
        title: 'PortSwigger: OAuth 2.0 authentication',
        url: 'https://portswigger.net/web-security/oauth',
      },
      {
        title: 'RFC 6749: The OAuth 2.0 Authorization Framework',
        url: 'https://www.rfc-editor.org/rfc/rfc6749.html',
      },
    ],
  },
  {
    id: 'concept.dompurify',
    kind: 'concept',
    match: {
      langs: ['javascript'],
      tokens: ['DOMPurify'],
      firstOnly: false,
    },
    term: { en: 'DOMPurify', es: 'DOMPurify' },
    short: {
      en: 'DOMPurify is a sanitizer that strips dangerous HTML before the browser parses it. It is widely used as a defense around sinks like `innerHTML`, but misconfiguration can still let markup through.',
      es: 'DOMPurify es un sanitizador que elimina HTML peligroso antes de que el navegador lo interprete. Se usa mucho como defensa alrededor de sinks como `innerHTML`, pero una mala configuración aún puede dejar pasar markup.',
    },
    refs: [
      {
        title: 'DOMPurify (cure53)',
        url: 'https://github.com/cure53/DOMPurify',
      },
      {
        title: 'PortSwigger: Preventing XSS',
        url: 'https://portswigger.net/web-security/cross-site-scripting/preventing',
      },
    ],
  },
  {
    id: 'concept.open-redirection',
    kind: 'concept',
    term: { en: 'Open redirection', es: 'Open redirection' },
    short: {
      en: 'Open redirection lets user input choose the `Location` (or JS equivalent) of a redirect. Attackers use it for phishing, and sometimes as a stepping stone to SSRF filter bypass.',
      es: 'Open redirection deja que la entrada del usuario elija el `Location` (o el equivalente en JS) de una redirección. Los atacantes lo usan para phishing y, a veces, como puente para saltar filtros de SSRF.',
    },
    partial: 'open-redirection',
    refs: [
      {
        title: 'PortSwigger: DOM-based open redirection',
        url: 'https://portswigger.net/web-security/dom-based/open-redirection',
      },
      {
        title: 'OWASP: Unvalidated Redirects and Forwards',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html',
      },
    ],
  },
  {
    id: 'concept.algorithm-confusion',
    kind: 'concept',
    term: { en: 'JWT algorithm confusion', es: 'Algorithm confusion en JWT' },
    short: {
      en: 'Algorithm confusion forges a JWT by switching `alg` from an asymmetric algorithm (RS256) to HMAC (HS256) and signing with the server\'s own public key. The server then verifies HMAC using that public key as the secret.',
      es: 'Algorithm confusion falsifica un JWT cambiando `alg` de un algoritmo asimétrico (RS256) a HMAC (HS256) y firmando con la clave pública del servidor. El servidor verifica entonces HMAC usando esa clave pública como secreto.',
    },
    partial: 'jwt-algorithm-confusion',
    refs: [
      {
        title: 'PortSwigger: JWT algorithm confusion',
        url: 'https://portswigger.net/web-security/jwt/algorithm-confusion',
      },
      {
        title: 'RFC 7519: JSON Web Token',
        url: 'https://www.rfc-editor.org/rfc/rfc7519.html',
      },
    ],
  },
  {
    id: 'concept.jwt-kid',
    kind: 'concept',
    term: { en: 'JWT kid path traversal', es: 'Path traversal en kid de JWT' },
    short: {
      en: 'The JWT `kid` (key ID) tells the server which key to use for verification. If the server treats `kid` as a file path, `../` can point it at a file whose contents become the HMAC secret.',
      es: 'El `kid` (key ID) de un JWT indica al servidor qué clave usar para verificar. Si el servidor trata `kid` como ruta de archivo, `../` puede apuntar a un archivo cuyo contenido pasa a ser el secreto HMAC.',
    },
    partial: 'jwt-kid-path-traversal',
    refs: [
      {
        title: 'PortSwigger: Injecting JWTs via the kid parameter',
        url: 'https://portswigger.net/web-security/jwt#injecting-self-signed-jwts-via-the-kid-parameter',
      },
      {
        title: 'RFC 7515: kid (Key ID) Header Parameter',
        url: 'https://www.rfc-editor.org/rfc/rfc7515.html#section-4.1.4',
      },
    ],
  },
  {
    id: 'concept.jwt-unverified',
    kind: 'concept',
    term: { en: 'Unverified JWT signature', es: 'Firma JWT sin verificar' },
    short: {
      en: 'Some servers decode a JWT and trust the payload without checking the signature. Anyone can then change claims such as `sub` and the server will still accept the token.',
      es: 'Algunos servidores decodifican un JWT y confían en el payload sin comprobar la firma. Cualquiera puede entonces cambiar claims como `sub` y el servidor seguirá aceptando el token.',
    },
    partial: 'jwt-unverified-signature',
    refs: [
      {
        title: 'PortSwigger: Flawed JWT signature verification',
        url: 'https://portswigger.net/web-security/jwt#flawed-jwt-signature-verification',
      },
      {
        title: 'RFC 7519: JSON Web Token',
        url: 'https://www.rfc-editor.org/rfc/rfc7519.html',
      },
    ],
  },
];
