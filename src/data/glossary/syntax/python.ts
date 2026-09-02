import type { GlossaryEntry, GlossaryMatch } from '../types';

function py(tokens: string[], firstOnly?: boolean): GlossaryMatch {
  return firstOnly === undefined
    ? { langs: ['python'], tokens }
    : { langs: ['python'], tokens, firstOnly };
}

export const PYTHON_SYNTAX: GlossaryEntry[] = [
  {
    id: 'syntax.py.def',
    kind: 'syntax',
    match: py(['def']),
    term: { en: 'def', es: 'def' },
    short: {
      en: 'Starts a function definition. The indented block under the name is the function body.',
      es: 'Inicia la definición de una función. El bloque indentado bajo el nombre es el cuerpo.',
    },
  },
  {
    id: 'syntax.py.import',
    kind: 'syntax',
    match: py(['import']),
    term: { en: 'import', es: 'import' },
    short: {
      en: 'Loads a module so its names can be used. `import ssl` binds the module; `from ssl import wrap_socket` binds a name from it.',
      es: 'Carga un módulo para poder usar sus nombres. `import ssl` enlaza el módulo; `from ssl import wrap_socket` enlaza un nombre de ese módulo.',
    },
  },
  {
    id: 'syntax.py.from',
    kind: 'syntax',
    match: py(['from']),
    term: { en: 'from', es: 'from' },
    short: {
      en: 'Used with `import` to pull specific names out of a module, as in `from urllib.parse import quote`.',
      es: 'Se usa con `import` para sacar nombres concretos de un módulo, como en `from urllib.parse import quote`.',
    },
  },
  {
    id: 'syntax.py.with',
    kind: 'syntax',
    match: py(['with']),
    term: { en: 'with', es: 'with' },
    short: {
      en: 'Opens a context manager and guarantees cleanup, even if an error occurs. Common with files: `with open(path) as f`.',
      es: 'Abre un context manager y garantiza la limpieza, incluso si hay un error. Es habitual con archivos: `with open(path) as f`.',
    },
  },
  {
    id: 'syntax.py.as',
    kind: 'syntax',
    match: py(['as']),
    term: { en: 'as', es: 'as' },
    short: {
      en: 'Binds a name in `import`, `except`, or `with`. Example: `with open(path) as handle`.',
      es: 'Enlaza un nombre en `import`, `except` o `with`. Ejemplo: `with open(path) as handle`.',
    },
  },
  {
    id: 'syntax.py.class',
    kind: 'syntax',
    match: py(['class']),
    term: { en: 'class', es: 'class' },
    short: {
      en: 'Starts a class definition. Instances share the class methods and can hold their own attributes.',
      es: 'Inicia la definición de una clase. Las instancias comparten los métodos de la clase y pueden guardar atributos propios.',
    },
  },
  {
    id: 'syntax.py.lambda',
    kind: 'syntax',
    match: py(['lambda']),
    term: { en: 'lambda', es: 'lambda' },
    short: {
      en: 'Defines a small anonymous function in one expression. It cannot contain statements.',
      es: 'Define una función anónima breve en una sola expresión. No puede contener sentencias.',
    },
  },
  {
    id: 'syntax.py.yield',
    kind: 'syntax',
    match: py(['yield']),
    term: { en: 'yield', es: 'yield' },
    short: {
      en: 'Turns a function into a generator. Each `yield` pauses and hands a value to the caller.',
      es: 'Convierte la función en un generador. Cada `yield` pausa y entrega un valor a quien llama.',
    },
  },
  {
    id: 'syntax.py.try',
    kind: 'syntax',
    match: py(['try']),
    term: { en: 'try', es: 'try' },
    short: {
      en: 'Starts a block that may raise an exception. A matching `except` (or `finally`) handles what goes wrong.',
      es: 'Inicia un bloque que puede lanzar una excepción. Un `except` (o `finally`) asociado se encarga de lo que falle.',
    },
  },
  {
    id: 'syntax.py.except',
    kind: 'syntax',
    match: py(['except']),
    term: { en: 'except', es: 'except' },
    short: {
      en: 'Catches an exception raised in the matching `try`. The type after `except` filters which errors are handled.',
      es: 'Captura una excepción lanzada en el `try` asociado. El tipo tras `except` filtra qué errores se manejan.',
    },
  },
  {
    id: 'syntax.py.None',
    kind: 'syntax',
    match: py(['None']),
    term: { en: 'None', es: 'None' },
    short: {
      en: 'Python\'s null value. It is a singleton; compare with `is None`, not `== None`.',
      es: 'El valor nulo de Python. Es un singleton; se compara con `is None`, no con `== None`.',
    },
  },
  {
    id: 'syntax.py.True',
    kind: 'syntax',
    match: py(['True']),
    term: { en: 'True', es: 'True' },
    short: {
      en: 'The boolean true value. In numeric context it equals `1`.',
      es: 'El valor booleano verdadero. En un contexto numérico equivale a `1`.',
    },
  },
  {
    id: 'syntax.py.False',
    kind: 'syntax',
    match: py(['False']),
    term: { en: 'False', es: 'False' },
    short: {
      en: 'The boolean false value. In numeric context it equals `0`. Empty containers are also falsy.',
      es: 'El valor booleano falso. En un contexto numérico equivale a `0`. Los contenedores vacíos también son falsy.',
    },
  },
  {
    id: 'syntax.py.print',
    kind: 'syntax',
    match: py(['print'], true),
    term: { en: 'print', es: 'print' },
    short: {
      en: 'Writes objects to stdout, separated by spaces and ending with a newline by default.',
      es: 'Escribe objetos en stdout, separados por espacios y con un salto de línea al final por defecto.',
    },
  },
  {
    id: 'syntax.py.len',
    kind: 'syntax',
    match: py(['len'], true),
    term: { en: 'len', es: 'len' },
    short: {
      en: 'Returns the number of items in a container, such as a string, list, or dict.',
      es: 'Devuelve el número de elementos de un contenedor, como una cadena, una lista o un dict.',
    },
  },
  {
    id: 'syntax.py.bytes',
    kind: 'syntax',
    match: py(['bytes']),
    term: { en: 'bytes', es: 'bytes' },
    short: {
      en: 'An immutable sequence of 8-bit values. HTTP bodies and sockets often use `bytes`, not `str`.',
      es: 'Una secuencia inmutable de valores de 8 bits. Los cuerpos HTTP y los sockets suelen usar `bytes`, no `str`.',
    },
  },
  {
    id: 'syntax.py.open',
    kind: 'syntax',
    match: py(['open']),
    term: { en: 'open', es: 'open' },
    short: {
      en: 'Opens a file and returns a file object. Use a `with` block so the file is closed afterward.',
      es: 'Abre un archivo y devuelve un objeto de archivo. Conviene un bloque `with` para que se cierre después.',
    },
  },
  {
    id: 'syntax.py.range',
    kind: 'syntax',
    match: py(['range']),
    term: { en: 'range', es: 'range' },
    short: {
      en: 'Yields a sequence of integers. `range(n)` is 0 through n-1, and it does not build a full list in memory on Python 3.',
      es: 'Produce una secuencia de enteros. `range(n)` va de 0 a n-1 y, en Python 3, no construye la lista completa en memoria.',
    },
  },
  {
    id: 'syntax.py.ssl',
    kind: 'syntax',
    match: py(['ssl'], false),
    term: { en: 'ssl', es: 'ssl' },
    short: {
      en: 'The standard-library TLS module. Lab scripts use it to wrap a raw socket in HTTPS without a high-level HTTP client.',
      es: 'El módulo TLS de la biblioteca estándar. En los labs envuelve un socket en bruto con HTTPS sin un cliente HTTP de alto nivel.',
    },
  },
  {
    id: 'syntax.py.socket',
    kind: 'syntax',
    match: py(['socket'], false),
    term: { en: 'socket', es: 'socket' },
    short: {
      en: 'The standard-library TCP (and UDP) module. Raw sockets are used when the exact bytes on the wire matter, as in request smuggling.',
      es: 'El módulo TCP (y UDP) de la biblioteca estándar. Los sockets en bruto se usan cuando importan los bytes exactos en el cable, como en request smuggling.',
    },
  },
  {
    id: 'syntax.py.create_default_context',
    kind: 'syntax',
    match: py(['ssl.create_default_context', 'create_default_context'], false),
    term: { en: 'create_default_context', es: 'create_default_context' },
    short: {
      en: 'Builds an `ssl.SSLContext` with safe defaults: TLS client mode, cert verification, and hostname checks. Lab scripts then wrap a raw TCP socket with it.',
      es: 'Crea un `ssl.SSLContext` con valores seguros: modo cliente TLS, verificación de certificado y comprobación de hostname. Los labs envuelven con él un socket TCP en bruto.',
    },
  },
  {
    id: 'syntax.py.wrap_socket',
    kind: 'syntax',
    match: py(['wrap_socket'], false),
    term: { en: 'wrap_socket', es: 'wrap_socket' },
    short: {
      en: 'Takes a connected TCP socket and returns an `SSLSocket` that speaks TLS. `server_hostname` is the SNI name sent in the handshake.',
      es: 'Toma un socket TCP ya conectado y devuelve un `SSLSocket` que habla TLS. `server_hostname` es el nombre SNI que se envía en el handshake.',
    },
  },
  {
    id: 'syntax.py.server_hostname',
    kind: 'syntax',
    match: py(['server_hostname'], true),
    term: { en: 'server_hostname', es: 'server_hostname' },
    short: {
      en: 'The hostname sent as SNI during the TLS handshake, and the name checked against the server certificate. It should match the host of the TCP connection.',
      es: 'El hostname enviado como SNI en el handshake TLS, y el nombre que se compara con el certificado del servidor. Debe coincidir con el host de la conexión TCP.',
    },
  },
  {
    id: 'syntax.py.create_connection',
    kind: 'syntax',
    match: py(['socket.create_connection', 'create_connection'], false),
    term: { en: 'create_connection', es: 'create_connection' },
    short: {
      en: 'Opens a TCP connection to `(host, port)` and returns a socket. Unlike `socket.socket()`, it handles DNS and IPv4/IPv6.',
      es: 'Abre una conexión TCP a `(host, port)` y devuelve un socket. A diferencia de `socket.socket()`, resuelve DNS y elige IPv4 o IPv6.',
    },
  },
  {
    id: 'syntax.py.settimeout',
    kind: 'syntax',
    match: py(['settimeout'], false),
    term: { en: 'settimeout', es: 'settimeout' },
    short: {
      en: 'Sets a blocking timeout in seconds on a socket. `recv` or `sendall` then raise `socket.timeout` if the peer is too slow, instead of hanging forever.',
      es: 'Pone un timeout de bloqueo en segundos en un socket. Entonces `recv` o `sendall` lanzan `socket.timeout` si el otro extremo tarda demasiado, en lugar de quedarse colgados.',
    },
  },
  {
    id: 'syntax.py.sendall',
    kind: 'syntax',
    match: py(['sendall'], false),
    term: { en: 'sendall', es: 'sendall' },
    short: {
      en: 'Writes every byte of a `bytes` object to the socket, retrying until the full buffer is sent. Use it instead of `send` when the whole HTTP request must go out.',
      es: 'Escribe todos los bytes de un objeto `bytes` en el socket, reintentando hasta enviar el buffer entero. Conviene más que `send` cuando tiene que salir la petición HTTP completa.',
    },
  },
  {
    id: 'syntax.py.recv',
    kind: 'syntax',
    match: py(['recv'], false),
    term: { en: 'recv', es: 'recv' },
    short: {
      en: 'Reads up to n bytes from the socket and returns `bytes`. It may return less than n; a smuggling script often only needs the first response line.',
      es: 'Lee hasta n bytes del socket y devuelve `bytes`. Puede devolver menos que n; un script de smuggling suele necesitar solo la primera línea de la respuesta.',
    },
  },
  {
    id: 'syntax.py.encode',
    kind: 'syntax',
    match: py(['encode'], true),
    term: { en: 'encode', es: 'encode' },
    short: {
      en: 'Turns a `str` into `bytes`, UTF-8 by default. HTTP requests on a raw socket need `bytes`, so f-strings are encoded before `sendall`.',
      es: 'Convierte un `str` en `bytes`, UTF-8 por defecto. Una petición HTTP en un socket en bruto necesita `bytes`, así que las f-strings se codifican antes de `sendall`.',
    },
  },
  {
    id: 'syntax.py.decode',
    kind: 'syntax',
    match: py(['decode'], true),
    term: { en: 'decode', es: 'decode' },
    short: {
      en: 'Turns `bytes` into a `str`, UTF-8 by default. Socket and Base64 results stay `bytes` until decoded for printing or parsing as text.',
      es: 'Convierte `bytes` en un `str`, UTF-8 por defecto. Lo que llega de un socket o de Base64 sigue siendo `bytes` hasta decodificarlo para imprimirlo o parsearlo como texto.',
    },
  },
  {
    id: 'syntax.py.split',
    kind: 'syntax',
    match: py(['split'], true),
    term: { en: 'split', es: 'split' },
    short: {
      en: 'Breaks a string or bytes object on a separator and returns a list. `JWT.split(\'.\')` yields header, payload, and signature; `split(b"\\r\\n", 1)` peels the first HTTP line.',
      es: 'Parte un string o un objeto bytes en un separador y devuelve una lista. `JWT.split(\'.\')` da header, payload y firma; `split(b"\\r\\n", 1)` separa la primera línea HTTP.',
    },
  },
  {
    id: 'syntax.py.splitlines',
    kind: 'syntax',
    match: py(['splitlines'], true),
    term: { en: 'splitlines', es: 'splitlines' },
    short: {
      en: 'Splits text on line breaks (`\\n`, `\\r\\n`, and friends) and returns a list of lines. Wordlists from `urlopen` are iterated this way.',
      es: 'Parte el texto por saltos de línea (`\\n`, `\\r\\n` y similares) y devuelve una lista de líneas. Así se recorren las wordlists que llegan de `urlopen`.',
    },
  },
  {
    id: 'syntax.py.rstrip',
    kind: 'syntax',
    match: py(['rstrip'], true),
    term: { en: 'rstrip', es: 'rstrip' },
    short: {
      en: 'Removes trailing characters from the right. JWT labs call `rstrip(\'=\')` so Base64URL padding is stripped for the compact token form.',
      es: 'Quita caracteres al final, por la derecha. En los labs de JWT se llama `rstrip(\'=\')` para quitar el padding Base64URL y dejar el token compacto.',
    },
  },
  {
    id: 'syntax.py.read',
    kind: 'syntax',
    match: py(['read'], true),
    term: { en: 'read', es: 'read' },
    short: {
      en: 'Reads the remaining content from a file-like object. After `urlopen`, `.read()` is the full HTTP body as `bytes`.',
      es: 'Lee el contenido que queda en un objeto file-like. Tras `urlopen`, `.read()` es el cuerpo HTTP completo como `bytes`.',
    },
  },
  {
    id: 'syntax.py.exit',
    kind: 'syntax',
    match: py(['exit'], true),
    term: { en: 'exit', es: 'exit' },
    short: {
      en: 'Stops the process. A non-zero argument, such as `exit(1)`, signals failure to the shell.',
      es: 'Detiene el proceso. Un argumento distinto de cero, como `exit(1)`, indica fallo al shell.',
    },
  },
  {
    id: 'syntax.py.from_bytes',
    kind: 'syntax',
    match: py(['int.from_bytes', 'from_bytes'], false),
    term: { en: 'from_bytes', es: 'from_bytes' },
    short: {
      en: '`int.from_bytes` reads a byte string as an integer. JWT `n` and `e` values are Base64URL blobs; `\'big\'` means the most significant byte comes first.',
      es: '`int.from_bytes` lee una cadena de bytes como entero. Los valores `n` y `e` de un JWT son blobs Base64URL; `\'big\'` significa que el byte más significativo va primero.',
    },
  },
  {
    id: 'syntax.py.hashlib',
    kind: 'syntax',
    match: py(['hashlib'], false),
    term: { en: 'hashlib', es: 'hashlib' },
    short: {
      en: 'The standard-library hashing module. Passing `hashlib.sha256` into `hmac.new` selects HMAC-SHA256, the HS256 algorithm used in JWTs.',
      es: 'El módulo de hashing de la biblioteca estándar. Pasar `hashlib.sha256` a `hmac.new` elige HMAC-SHA256, el algoritmo HS256 de los JWT.',
    },
  },
  {
    id: 'syntax.py.sha256',
    kind: 'syntax',
    match: py(['hashlib.sha256', 'sha256'], false),
    term: { en: 'sha256', es: 'sha256' },
    short: {
      en: 'The SHA-256 hash constructor in `hashlib`. As the third argument to `hmac.new`, it means the MAC is HMAC-SHA256 (JWT `HS256`).',
      es: 'El constructor SHA-256 de `hashlib`. Como tercer argumento de `hmac.new`, indica que el MAC es HMAC-SHA256 (el `HS256` de JWT).',
    },
  },
  {
    id: 'syntax.py.hmac',
    kind: 'syntax',
    match: py(['hmac'], false),
    term: { en: 'hmac', es: 'hmac' },
    short: {
      en: 'The standard-library HMAC module. JWTs with `alg: HS256` are an HMAC over `header.payload` using a shared secret.',
      es: 'El módulo HMAC de la biblioteca estándar. Los JWT con `alg: HS256` son un HMAC sobre `header.payload` con un secreto compartido.',
    },
  },
  {
    id: 'syntax.py.hmac.new',
    kind: 'syntax',
    match: py(['hmac.new'], false),
    term: { en: 'hmac.new', es: 'hmac.new' },
    short: {
      en: 'Creates an HMAC object from a key, a message, and a hash constructor such as `hashlib.sha256`. Call `.digest()` to get the raw signature bytes.',
      es: 'Crea un objeto HMAC a partir de una clave, un mensaje y un constructor de hash como `hashlib.sha256`. `.digest()` devuelve los bytes crudos de la firma.',
    },
  },
  {
    id: 'syntax.py.digest',
    kind: 'syntax',
    match: py(['digest'], false),
    term: { en: 'digest', es: 'digest' },
    short: {
      en: 'Returns the HMAC (or hash) result as raw `bytes`. JWT signatures Base64URL-encode this value, without the hex string from `hexdigest()`.',
      es: 'Devuelve el resultado HMAC (o hash) como `bytes` crudos. Las firmas JWT codifican este valor en Base64URL, no la cadena hex de `hexdigest()`.',
    },
  },
  {
    id: 'syntax.py.base64',
    kind: 'syntax',
    match: py(['base64'], false),
    term: { en: 'base64', es: 'base64' },
    short: {
      en: 'The standard-library Base64 module. JWT parts use the URL-safe alphabet (`-` and `_` instead of `+` and `/`) via `urlsafe_b64encode` / `urlsafe_b64decode`.',
      es: 'El módulo Base64 de la biblioteca estándar. Las partes de un JWT usan el alfabeto URL-safe (`-` y `_` en lugar de `+` y `/`) con `urlsafe_b64encode` / `urlsafe_b64decode`.',
    },
  },
  {
    id: 'syntax.py.urlsafe_b64encode',
    kind: 'syntax',
    match: py(['base64.urlsafe_b64encode', 'urlsafe_b64encode'], false),
    term: { en: 'urlsafe_b64encode', es: 'urlsafe_b64encode' },
    short: {
      en: 'Base64-encodes bytes using `-` and `_` so the result is safe in URLs and JWT tokens. Labs then `rstrip(\'=\')` to drop padding.',
      es: 'Codifica bytes en Base64 con `-` y `_` para que el resultado sea seguro en URLs y tokens JWT. Luego los labs hacen `rstrip(\'=\')` para quitar el padding.',
    },
  },
  {
    id: 'syntax.py.urlsafe_b64decode',
    kind: 'syntax',
    match: py(['base64.urlsafe_b64decode', 'urlsafe_b64decode'], false),
    term: { en: 'urlsafe_b64decode', es: 'urlsafe_b64decode' },
    short: {
      en: 'Decodes URL-safe Base64 into `bytes`. JWT payload segments often need `==` padding appended before this call will accept them.',
      es: 'Decodifica Base64 URL-safe a `bytes`. Los segmentos de payload JWT a menudo necesitan padding `==` al final para que esta llamada los acepte.',
    },
  },
  {
    id: 'syntax.py.json',
    kind: 'syntax',
    match: py(['json'], false),
    term: { en: 'json', es: 'json' },
    short: {
      en: 'The standard-library JSON module. JWT payloads are JSON objects; `loads` parses them and `dumps` writes them back.',
      es: 'El módulo JSON de la biblioteca estándar. Los payloads JWT son objetos JSON; `loads` los interpreta y `dumps` los vuelve a escribir.',
    },
  },
  {
    id: 'syntax.py.json.loads',
    kind: 'syntax',
    match: py(['json.loads', 'loads'], false),
    term: { en: 'json.loads', es: 'json.loads' },
    short: {
      en: 'Parses a JSON string (or UTF-8 bytes) into a Python dict or list. After Base64-decoding a JWT payload, this is how claims such as `sub` become editable.',
      es: 'Interpreta una cadena JSON (o bytes UTF-8) como dict o lista de Python. Tras decodificar el payload de un JWT en Base64, así las claims como `sub` se pueden editar.',
    },
  },
  {
    id: 'syntax.py.json.dumps',
    kind: 'syntax',
    match: py(['json.dumps', 'dumps'], false),
    term: { en: 'json.dumps', es: 'json.dumps' },
    short: {
      en: 'Serializes a Python object to a JSON string. `separators=(\',\', \':\')` drops extra spaces so the JWT payload stays compact.',
      es: 'Serializa un objeto de Python a una cadena JSON. `separators=(\',\', \':\')` quita espacios de más para que el payload JWT quede compacto.',
    },
  },
  {
    id: 'syntax.py.urllib.request',
    kind: 'syntax',
    match: py(['urllib.request'], false),
    term: { en: 'urllib.request', es: 'urllib.request' },
    short: {
      en: 'The standard-library HTTP client. `urlopen` fetches a URL and returns a file-like response; labs use it to download a JWT secret wordlist.',
      es: 'El cliente HTTP de la biblioteca estándar. `urlopen` pide una URL y devuelve una respuesta file-like; en los labs descarga una wordlist de secretos JWT.',
    },
  },
  {
    id: 'syntax.py.urlopen',
    kind: 'syntax',
    match: py(['urllib.request.urlopen', 'urlopen'], false),
    term: { en: 'urlopen', es: 'urlopen' },
    short: {
      en: 'Opens a URL and returns a file-like HTTP response. `.read()` then yields the body as `bytes`.',
      es: 'Abre una URL y devuelve una respuesta HTTP file-like. Luego `.read()` da el cuerpo como `bytes`.',
    },
  },
  {
    id: 'syntax.py.requests',
    kind: 'syntax',
    match: py(['requests'], false),
    term: { en: 'requests', es: 'requests' },
    short: {
      en: 'A third-party HTTP client with sessions, cookies, and redirects. Unlike a raw socket, it builds well-formed requests and does not expose every byte on the wire.',
      es: 'Un cliente HTTP de terceros con sesiones, cookies y redirecciones. A diferencia de un socket en bruto, construye peticiones bien formadas y no controlas cada byte en el cable.',
    },
  },
  {
    id: 'syntax.py.Session',
    kind: 'syntax',
    match: py(['requests.Session', 'Session'], false),
    term: { en: 'Session', es: 'Session' },
    short: {
      en: 'A `requests` session that keeps cookies across calls. A second `Session()` is a clean jar, which matters when the first session already talked to another host.',
      es: 'Una sesión de `requests` que conserva cookies entre llamadas. Un segundo `Session()` es un tarro limpio, importante si la primera sesión ya habló con otro host.',
    },
  },
  {
    id: 'syntax.py.get',
    kind: 'syntax',
    match: py(['get'], true),
    term: { en: 'get', es: 'get' },
    short: {
      en: 'Sends an HTTP GET on a `requests` session or module. The return value is a Response with `.text`, `.status_code`, and cookies stored on the session.',
      es: 'Envía un HTTP GET en una sesión o en el módulo `requests`. El valor de retorno es un Response con `.text`, `.status_code` y cookies guardadas en la sesión.',
    },
  },
  {
    id: 'syntax.py.post',
    kind: 'syntax',
    match: py(['post'], true),
    term: { en: 'post', es: 'post' },
    short: {
      en: 'Sends an HTTP POST on a `requests` session. The `data=` mapping becomes a form body (`application/x-www-form-urlencoded`).',
      es: 'Envía un HTTP POST en una sesión de `requests`. El mapeo `data=` pasa a ser un cuerpo de formulario (`application/x-www-form-urlencoded`).',
    },
  },
  {
    id: 'syntax.py.status_code',
    kind: 'syntax',
    match: py(['status_code'], true),
    term: { en: 'status_code', es: 'status_code' },
    short: {
      en: 'The numeric HTTP status on a `requests` Response, such as `200` or `404`.',
      es: 'El código de estado HTTP numérico de un Response de `requests`, por ejemplo `200` o `404`.',
    },
  },
  {
    id: 'syntax.py.allow_redirects',
    kind: 'syntax',
    match: py(['allow_redirects'], true),
    term: { en: 'allow_redirects', es: 'allow_redirects' },
    short: {
      en: 'When `True`, `requests` follows 3xx `Location` headers. An OAuth callback often redirects to the app after the code is consumed.',
      es: 'Si es `True`, `requests` sigue las cabeceras `Location` 3xx. Un callback OAuth suele redirigir a la app después de consumir el code.',
    },
  },
  {
    id: 'syntax.py.re',
    kind: 'syntax',
    match: py(['re'], false),
    term: { en: 're', es: 're' },
    short: {
      en: 'The standard-library regular-expression module. `search` scans a string for the first match; capturing groups pull out ids and codes.',
      es: 'El módulo de expresiones regulares de la biblioteca estándar. `search` busca la primera coincidencia en una cadena; los grupos de captura extraen ids y codes.',
    },
  },
  {
    id: 'syntax.py.re.search',
    kind: 'syntax',
    match: py(['re.search', 'search'], false),
    term: { en: 're.search', es: 're.search' },
    short: {
      en: 'Scans a string for the first match of a regex and returns a match object, or `None`. Unlike `match`, it need not start at the beginning.',
      es: 'Busca en una cadena la primera coincidencia de una regex y devuelve un match, o `None`. A diferencia de `match`, no tiene que empezar al inicio.',
    },
  },
  {
    id: 'syntax.py.group',
    kind: 'syntax',
    match: py(['group'], true),
    term: { en: 'group', es: 'group' },
    short: {
      en: 'On a regex match, `.group(1)` is the text of the first capturing parenthesis. `.group(0)` is the whole match.',
      es: 'En un match de regex, `.group(1)` es el texto del primer paréntesis de captura. `.group(0)` es la coincidencia entera.',
    },
  },
  {
    id: 'syntax.py.time',
    kind: 'syntax',
    match: py(['time'], false),
    term: { en: 'time', es: 'time' },
    short: {
      en: 'The standard-library time module. Lab scripts call `sleep` to wait for a victim to hit the exploit server before reading logs.',
      es: 'El módulo de tiempo de la biblioteca estándar. Los labs llaman a `sleep` para esperar a que la víctima cargue el exploit server antes de leer los logs.',
    },
  },
  {
    id: 'syntax.py.sleep',
    kind: 'syntax',
    match: py(['time.sleep', 'sleep'], false),
    term: { en: 'sleep', es: 'sleep' },
    short: {
      en: 'Pauses the current thread for the given number of seconds. Used to wait out an async step, such as a victim loading a delivered page.',
      es: 'Pausa el hilo actual el número de segundos indicado. Sirve para esperar un paso asíncrono, como que la víctima cargue una página entregada.',
    },
  },
  {
    id: 'syntax.py.cryptography',
    kind: 'syntax',
    match: py(['cryptography'], false),
    term: { en: 'cryptography', es: 'cryptography' },
    short: {
      en: 'A third-party crypto library. The `hazmat` layer exposes RSA primitives so a JWK `n` and `e` can be turned into a PEM public key.',
      es: 'Una biblioteca de criptografía de terceros. La capa `hazmat` expone primitivas RSA para convertir el `n` y `e` de un JWK en una clave pública PEM.',
    },
  },
  {
    id: 'syntax.py.serialization',
    kind: 'syntax',
    match: py(['serialization'], false),
    term: { en: 'serialization', es: 'serialization' },
    short: {
      en: 'The `cryptography` module that encodes keys to bytes. `Encoding.PEM` plus `PublicFormat.SubjectPublicKeyInfo` is the usual PEM public-key blob.',
      es: 'El módulo de `cryptography` que pasa claves a bytes. `Encoding.PEM` más `PublicFormat.SubjectPublicKeyInfo` es el blob PEM habitual de clave pública.',
    },
  },
  {
    id: 'syntax.py.rsa',
    kind: 'syntax',
    match: py(['rsa'], false),
    term: { en: 'rsa', es: 'rsa' },
    short: {
      en: 'The `cryptography` RSA module. `RSAPublicNumbers(e, n).public_key()` builds a public key from a JWK modulus and exponent.',
      es: 'El módulo RSA de `cryptography`. `RSAPublicNumbers(e, n).public_key()` construye una clave pública a partir del módulo y el exponente de un JWK.',
    },
  },
  {
    id: 'syntax.py.RSAPublicNumbers',
    kind: 'syntax',
    match: py(['rsa.RSAPublicNumbers', 'RSAPublicNumbers'], false),
    term: { en: 'RSAPublicNumbers', es: 'RSAPublicNumbers' },
    short: {
      en: 'Holds an RSA public exponent `e` and modulus `n`. Calling `.public_key()` turns those two integers into a key object.',
      es: 'Guarda el exponente público `e` y el módulo `n` de RSA. `.public_key()` convierte esos dos enteros en un objeto clave.',
    },
  },
  {
    id: 'syntax.py.public_key',
    kind: 'syntax',
    match: py(['public_key'], false),
    term: { en: 'public_key', es: 'public_key' },
    short: {
      en: 'Builds an RSA public key from `RSAPublicNumbers`. Algorithm-confusion labs then export it as PEM and use those bytes as an HMAC secret.',
      es: 'Construye una clave pública RSA a partir de `RSAPublicNumbers`. En los labs de algorithm confusion se exporta a PEM y esos bytes se usan como secreto HMAC.',
    },
  },
  {
    id: 'syntax.py.public_bytes',
    kind: 'syntax',
    match: py(['public_bytes'], false),
    term: { en: 'public_bytes', es: 'public_bytes' },
    short: {
      en: 'Serializes a public key to `bytes`. With PEM encoding this is the `-----BEGIN PUBLIC KEY-----` block that HS256 labs misuse as the HMAC key.',
      es: 'Serializa una clave pública a `bytes`. Con encoding PEM es el bloque `-----BEGIN PUBLIC KEY-----` que los labs de HS256 usan mal como clave HMAC.',
    },
  },
  {
    id: 'syntax.py.Encoding.PEM',
    kind: 'syntax',
    match: py(['serialization.Encoding.PEM', 'Encoding.PEM'], false),
    term: { en: 'Encoding.PEM', es: 'Encoding.PEM' },
    short: {
      en: 'Tells `public_bytes` to emit PEM (Base64 with `BEGIN` / `END` banners) instead of raw DER. That textual form is what gets reused as an HMAC secret.',
      es: 'Indica a `public_bytes` que emita PEM (Base64 con banners `BEGIN` / `END`) en lugar de DER crudo. Esa forma de texto es la que se reutiliza como secreto HMAC.',
    },
  },
  {
    id: 'syntax.py.SubjectPublicKeyInfo',
    kind: 'syntax',
    match: py(
      ['serialization.PublicFormat.SubjectPublicKeyInfo', 'PublicFormat.SubjectPublicKeyInfo', 'SubjectPublicKeyInfo'],
      false,
    ),
    term: { en: 'SubjectPublicKeyInfo', es: 'SubjectPublicKeyInfo' },
    short: {
      en: 'The X.509 SPKI layout for a public key: algorithm identifier plus the key bits. Combined with PEM encoding, it is the usual `BEGIN PUBLIC KEY` document.',
      es: 'El formato X.509 SPKI de una clave pública: identificador de algoritmo más los bits de la clave. Junto con encoding PEM, es el documento habitual `BEGIN PUBLIC KEY`.',
    },
  },
];
