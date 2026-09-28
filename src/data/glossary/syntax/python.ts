import type { GlossaryEntry, GlossaryMatch } from '../types'

function py(tokens: string[], firstOnly?: boolean): GlossaryMatch {
  return firstOnly === undefined
    ? { langs: ['python'], tokens }
    : { langs: ['python'], tokens, firstOnly }
}

export const PYTHON_SYNTAX: GlossaryEntry[] = [
  {
    id: 'syntax.py.def',
    kind: 'syntax',
    match: py(['def']),
    term: { en: 'def' },
    short: {
      en: 'Starts a function definition. The indented block under the name is the function body.',
    },
  },
  {
    id: 'syntax.py.import',
    kind: 'syntax',
    match: py(['import']),
    term: { en: 'import' },
    short: {
      en: 'Loads a module so its names can be used. `import ssl` binds the module; `from ssl import wrap_socket` binds a name from it.',
    },
  },
  {
    id: 'syntax.py.from',
    kind: 'syntax',
    match: py(['from']),
    term: { en: 'from' },
    short: {
      en: 'Used with `import` to pull specific names out of a module, as in `from urllib.parse import quote`.',
    },
  },
  {
    id: 'syntax.py.with',
    kind: 'syntax',
    match: py(['with']),
    term: { en: 'with' },
    short: {
      en: 'Opens a context manager and guarantees cleanup, even if an error occurs. Common with files: `with open(path) as f`.',
    },
  },
  {
    id: 'syntax.py.as',
    kind: 'syntax',
    match: py(['as']),
    term: { en: 'as' },
    short: {
      en: 'Binds a name in `import`, `except`, or `with`. Example: `with open(path) as handle`.',
    },
  },
  {
    id: 'syntax.py.class',
    kind: 'syntax',
    match: py(['class']),
    term: { en: 'class' },
    short: {
      en: 'Starts a class definition. Instances share the class methods and can hold their own attributes.',
    },
  },
  {
    id: 'syntax.py.lambda',
    kind: 'syntax',
    match: py(['lambda']),
    term: { en: 'lambda' },
    short: {
      en: 'Defines a small anonymous function in one expression. It cannot contain statements.',
    },
  },
  {
    id: 'syntax.py.yield',
    kind: 'syntax',
    match: py(['yield']),
    term: { en: 'yield' },
    short: {
      en: 'Turns a function into a generator. Each `yield` pauses and hands a value to the caller.',
    },
  },
  {
    id: 'syntax.py.try',
    kind: 'syntax',
    match: py(['try']),
    term: { en: 'try' },
    short: {
      en: 'Starts a block that may raise an exception. A matching `except` (or `finally`) handles what goes wrong.',
    },
  },
  {
    id: 'syntax.py.except',
    kind: 'syntax',
    match: py(['except']),
    term: { en: 'except' },
    short: {
      en: 'Catches an exception raised in the matching `try`. The type after `except` filters which errors are handled.',
    },
  },
  {
    id: 'syntax.py.None',
    kind: 'syntax',
    match: py(['None']),
    term: { en: 'None' },
    short: {
      en: 'Python\'s null value. It is a singleton; compare with `is None`, not `== None`.',
    },
  },
  {
    id: 'syntax.py.True',
    kind: 'syntax',
    match: py(['True']),
    term: { en: 'True' },
    short: {
      en: 'The boolean true value. In numeric context it equals `1`.',
    },
  },
  {
    id: 'syntax.py.False',
    kind: 'syntax',
    match: py(['False']),
    term: { en: 'False' },
    short: {
      en: 'The boolean false value. In numeric context it equals `0`. Empty containers are also falsy.',
    },
  },
  {
    id: 'syntax.py.print',
    kind: 'syntax',
    match: py(['print'], true),
    term: { en: 'print' },
    short: {
      en: 'Writes objects to stdout, separated by spaces and ending with a newline by default.',
    },
  },
  {
    id: 'syntax.py.len',
    kind: 'syntax',
    match: py(['len'], true),
    term: { en: 'len' },
    short: {
      en: 'Returns the number of items in a container, such as a string, list, or dict.',
    },
  },
  {
    id: 'syntax.py.bytes',
    kind: 'syntax',
    match: py(['bytes']),
    term: { en: 'bytes' },
    short: {
      en: 'An immutable sequence of 8-bit values. HTTP bodies and sockets often use `bytes`, not `str`.',
    },
  },
  {
    id: 'syntax.py.open',
    kind: 'syntax',
    match: py(['open']),
    term: { en: 'open' },
    short: {
      en: 'Opens a file and returns a file object. Use a `with` block so the file is closed afterward.',
    },
  },
  {
    id: 'syntax.py.range',
    kind: 'syntax',
    match: py(['range']),
    term: { en: 'range' },
    short: {
      en: 'Yields a sequence of integers. `range(n)` is 0 through n-1, and it does not build a full list in memory on Python 3.',
    },
  },
  {
    id: 'syntax.py.ssl',
    kind: 'syntax',
    match: py(['ssl'], false),
    term: { en: 'ssl' },
    short: {
      en: 'The standard-library TLS module. Lab scripts use it to wrap a raw socket in HTTPS without a high-level HTTP client.',
    },
  },
  {
    id: 'syntax.py.socket',
    kind: 'syntax',
    match: py(['socket'], false),
    term: { en: 'socket' },
    short: {
      en: 'The standard-library TCP (and UDP) module. Raw sockets are used when the exact bytes on the wire matter, as in request smuggling.',
    },
  },
  {
    id: 'syntax.py.create_default_context',
    kind: 'syntax',
    match: py(['ssl.create_default_context', 'create_default_context'], false),
    term: { en: 'create_default_context' },
    short: {
      en: 'Builds an `ssl.SSLContext` with safe defaults: TLS client mode, cert verification, and hostname checks. Lab scripts then wrap a raw TCP socket with it.',
    },
  },
  {
    id: 'syntax.py.wrap_socket',
    kind: 'syntax',
    match: py(['wrap_socket'], false),
    term: { en: 'wrap_socket' },
    short: {
      en: 'Takes a connected TCP socket and returns an `SSLSocket` that speaks TLS. `server_hostname` is the SNI name sent in the handshake.',
    },
  },
  {
    id: 'syntax.py.server_hostname',
    kind: 'syntax',
    match: py(['server_hostname'], true),
    term: { en: 'server_hostname' },
    short: {
      en: 'The hostname sent as SNI during the TLS handshake, and the name checked against the server certificate. It should match the host of the TCP connection.',
    },
  },
  {
    id: 'syntax.py.create_connection',
    kind: 'syntax',
    match: py(['socket.create_connection', 'create_connection'], false),
    term: { en: 'create_connection' },
    short: {
      en: 'Opens a TCP connection to `(host, port)` and returns a socket. Unlike `socket.socket()`, it handles DNS and IPv4/IPv6.',
    },
  },
  {
    id: 'syntax.py.settimeout',
    kind: 'syntax',
    match: py(['settimeout'], false),
    term: { en: 'settimeout' },
    short: {
      en: 'Sets a blocking timeout in seconds on a socket. `recv` or `sendall` then raise `socket.timeout` if the peer is too slow, instead of hanging forever.',
    },
  },
  {
    id: 'syntax.py.sendall',
    kind: 'syntax',
    match: py(['sendall'], false),
    term: { en: 'sendall' },
    short: {
      en: 'Writes every byte of a `bytes` object to the socket, retrying until the full buffer is sent. Use it instead of `send` when the whole HTTP request must go out.',
    },
  },
  {
    id: 'syntax.py.recv',
    kind: 'syntax',
    match: py(['recv'], false),
    term: { en: 'recv' },
    short: {
      en: 'Reads up to n bytes from the socket and returns `bytes`. It may return less than n; a smuggling script often only needs the first response line.',
    },
  },
  {
    id: 'syntax.py.encode',
    kind: 'syntax',
    match: py(['encode'], true),
    term: { en: 'encode' },
    short: {
      en: 'Turns a `str` into `bytes`, UTF-8 by default. HTTP requests on a raw socket need `bytes`, so f-strings are encoded before `sendall`.',
    },
  },
  {
    id: 'syntax.py.decode',
    kind: 'syntax',
    match: py(['decode'], true),
    term: { en: 'decode' },
    short: {
      en: 'Turns `bytes` into a `str`, UTF-8 by default. Socket and Base64 results stay `bytes` until decoded for printing or parsing as text.',
    },
  },
  {
    id: 'syntax.py.split',
    kind: 'syntax',
    match: py(['split'], true),
    term: { en: 'split' },
    short: {
      en: 'Breaks a string or bytes object on a separator and returns a list. `JWT.split(\'.\')` yields header, payload, and signature; `split(b"\\r\\n", 1)` peels the first HTTP line.',
    },
  },
  {
    id: 'syntax.py.splitlines',
    kind: 'syntax',
    match: py(['splitlines'], true),
    term: { en: 'splitlines' },
    short: {
      en: 'Splits text on line breaks (`\\n`, `\\r\\n`, and friends) and returns a list of lines. Wordlists from `urlopen` are iterated this way.',
    },
  },
  {
    id: 'syntax.py.rstrip',
    kind: 'syntax',
    match: py(['rstrip'], true),
    term: { en: 'rstrip' },
    short: {
      en: 'Removes trailing characters from the right. JWT labs call `rstrip(\'=\')` so Base64URL padding is stripped for the compact token form.',
    },
  },
  {
    id: 'syntax.py.read',
    kind: 'syntax',
    match: py(['read'], true),
    term: { en: 'read' },
    short: {
      en: 'Reads the remaining content from a file-like object. After `urlopen`, `.read()` is the full HTTP body as `bytes`.',
    },
  },
  {
    id: 'syntax.py.exit',
    kind: 'syntax',
    match: py(['exit'], true),
    term: { en: 'exit' },
    short: {
      en: 'Stops the process. A non-zero argument, such as `exit(1)`, signals failure to the shell.',
    },
  },
  {
    id: 'syntax.py.from_bytes',
    kind: 'syntax',
    match: py(['int.from_bytes', 'from_bytes'], false),
    term: { en: 'from_bytes' },
    short: {
      en: '`int.from_bytes` reads a byte string as an integer. JWT `n` and `e` values are Base64URL blobs; `\'big\'` means the most significant byte comes first.',
    },
  },
  {
    id: 'syntax.py.hashlib',
    kind: 'syntax',
    match: py(['hashlib'], false),
    term: { en: 'hashlib' },
    short: {
      en: 'The standard-library hashing module. Passing `hashlib.sha256` into `hmac.new` selects HMAC-SHA256, the HS256 algorithm used in JWTs.',
    },
  },
  {
    id: 'syntax.py.sha256',
    kind: 'syntax',
    match: py(['hashlib.sha256', 'sha256'], false),
    term: { en: 'sha256' },
    short: {
      en: 'The SHA-256 hash constructor in `hashlib`. As the third argument to `hmac.new`, it means the MAC is HMAC-SHA256 (JWT `HS256`).',
    },
  },
  {
    id: 'syntax.py.hmac',
    kind: 'syntax',
    match: py(['hmac'], false),
    term: { en: 'hmac' },
    short: {
      en: 'The standard-library HMAC module. JWTs with `alg: HS256` are an HMAC over `header.payload` using a shared secret.',
    },
  },
  {
    id: 'syntax.py.hmac.new',
    kind: 'syntax',
    match: py(['hmac.new'], false),
    term: { en: 'hmac.new' },
    short: {
      en: 'Creates an HMAC object from a key, a message, and a hash constructor such as `hashlib.sha256`. Call `.digest()` to get the raw signature bytes.',
    },
  },
  {
    id: 'syntax.py.digest',
    kind: 'syntax',
    match: py(['digest'], false),
    term: { en: 'digest' },
    short: {
      en: 'Returns the HMAC (or hash) result as raw `bytes`. JWT signatures Base64URL-encode this value, without the hex string from `hexdigest()`.',
    },
  },
  {
    id: 'syntax.py.base64',
    kind: 'syntax',
    match: py(['base64'], false),
    term: { en: 'base64' },
    short: {
      en: 'The standard-library Base64 module. JWT parts use the URL-safe alphabet (`-` and `_` instead of `+` and `/`) via `urlsafe_b64encode` / `urlsafe_b64decode`.',
    },
  },
  {
    id: 'syntax.py.urlsafe_b64encode',
    kind: 'syntax',
    match: py(['base64.urlsafe_b64encode', 'urlsafe_b64encode'], false),
    term: { en: 'urlsafe_b64encode' },
    short: {
      en: 'Base64-encodes bytes using `-` and `_` so the result is safe in URLs and JWT tokens. Labs then `rstrip(\'=\')` to drop padding.',
    },
  },
  {
    id: 'syntax.py.urlsafe_b64decode',
    kind: 'syntax',
    match: py(['base64.urlsafe_b64decode', 'urlsafe_b64decode'], false),
    term: { en: 'urlsafe_b64decode' },
    short: {
      en: 'Decodes URL-safe Base64 into `bytes`. JWT payload segments often need `==` padding appended before this call will accept them.',
    },
  },
  {
    id: 'syntax.py.json',
    kind: 'syntax',
    match: py(['json'], false),
    term: { en: 'json' },
    short: {
      en: 'The standard-library JSON module. JWT payloads are JSON objects; `loads` parses them and `dumps` writes them back.',
    },
  },
  {
    id: 'syntax.py.json.loads',
    kind: 'syntax',
    match: py(['json.loads', 'loads'], false),
    term: { en: 'json.loads' },
    short: {
      en: 'Parses a JSON string (or UTF-8 bytes) into a Python dict or list. After Base64-decoding a JWT payload, this is how claims such as `sub` become editable.',
    },
  },
  {
    id: 'syntax.py.json.dumps',
    kind: 'syntax',
    match: py(['json.dumps', 'dumps'], false),
    term: { en: 'json.dumps' },
    short: {
      en: 'Serializes a Python object to a JSON string. `separators=(\',\', \':\')` drops extra spaces so the JWT payload stays compact.',
    },
  },
  {
    id: 'syntax.py.urllib.request',
    kind: 'syntax',
    match: py(['urllib.request'], false),
    term: { en: 'urllib.request' },
    short: {
      en: 'The standard-library HTTP client. `urlopen` fetches a URL and returns a file-like response; labs use it to download a JWT secret wordlist.',
    },
  },
  {
    id: 'syntax.py.urlopen',
    kind: 'syntax',
    match: py(['urllib.request.urlopen', 'urlopen'], false),
    term: { en: 'urlopen' },
    short: {
      en: 'Opens a URL and returns a file-like HTTP response. `.read()` then yields the body as `bytes`.',
    },
  },
  {
    id: 'syntax.py.requests',
    kind: 'syntax',
    match: py(['requests'], false),
    term: { en: 'requests' },
    short: {
      en: 'A third-party HTTP client with sessions, cookies, and redirects. Unlike a raw socket, it builds well-formed requests and does not expose every byte on the wire.',
    },
  },
  {
    id: 'syntax.py.Session',
    kind: 'syntax',
    match: py(['requests.Session', 'Session'], false),
    term: { en: 'Session' },
    short: {
      en: 'A `requests` session that keeps cookies across calls. A second `Session()` is a clean jar, which matters when the first session already talked to another host.',
    },
  },
  {
    id: 'syntax.py.get',
    kind: 'syntax',
    match: py(['get'], true),
    term: { en: 'get' },
    short: {
      en: 'Sends an HTTP GET on a `requests` session or module. The return value is a Response with `.text`, `.status_code`, and cookies stored on the session.',
    },
  },
  {
    id: 'syntax.py.post',
    kind: 'syntax',
    match: py(['post'], true),
    term: { en: 'post' },
    short: {
      en: 'Sends an HTTP POST on a `requests` session. The `data=` mapping becomes a form body (`application/x-www-form-urlencoded`).',
    },
  },
  {
    id: 'syntax.py.status_code',
    kind: 'syntax',
    match: py(['status_code'], true),
    term: { en: 'status_code' },
    short: {
      en: 'The numeric HTTP status on a `requests` Response, such as `200` or `404`.',
    },
  },
  {
    id: 'syntax.py.allow_redirects',
    kind: 'syntax',
    match: py(['allow_redirects'], true),
    term: { en: 'allow_redirects' },
    short: {
      en: 'When `True`, `requests` follows 3xx `Location` headers. An OAuth callback often redirects to the app after the code is consumed.',
    },
  },
  {
    id: 'syntax.py.re',
    kind: 'syntax',
    match: py(['re'], false),
    term: { en: 're' },
    short: {
      en: 'The standard-library regular-expression module. `search` scans a string for the first match; capturing groups pull out ids and codes.',
    },
  },
  {
    id: 'syntax.py.re.search',
    kind: 'syntax',
    match: py(['re.search', 'search'], false),
    term: { en: 're.search' },
    short: {
      en: 'Scans a string for the first match of a regex and returns a match object, or `None`. Unlike `match`, it need not start at the beginning.',
    },
  },
  {
    id: 'syntax.py.group',
    kind: 'syntax',
    match: py(['group'], true),
    term: { en: 'group' },
    short: {
      en: 'On a regex match, `.group(1)` is the text of the first capturing parenthesis. `.group(0)` is the whole match.',
    },
  },
  {
    id: 'syntax.py.time',
    kind: 'syntax',
    match: py(['time'], false),
    term: { en: 'time' },
    short: {
      en: 'The standard-library time module. Lab scripts call `sleep` to wait for a victim to hit the exploit server before reading logs.',
    },
  },
  {
    id: 'syntax.py.sleep',
    kind: 'syntax',
    match: py(['time.sleep', 'sleep'], false),
    term: { en: 'sleep' },
    short: {
      en: 'Pauses the current thread for the given number of seconds. Used to wait out an async step, such as a victim loading a delivered page.',
    },
  },
  {
    id: 'syntax.py.cryptography',
    kind: 'syntax',
    match: py(['cryptography'], false),
    term: { en: 'cryptography' },
    short: {
      en: 'A third-party crypto library. The `hazmat` layer exposes RSA primitives so a JWK `n` and `e` can be turned into a PEM public key.',
    },
  },
  {
    id: 'syntax.py.serialization',
    kind: 'syntax',
    match: py(['serialization'], false),
    term: { en: 'serialization' },
    short: {
      en: 'The `cryptography` module that encodes keys to bytes. `Encoding.PEM` plus `PublicFormat.SubjectPublicKeyInfo` is the usual PEM public-key blob.',
    },
  },
  {
    id: 'syntax.py.rsa',
    kind: 'syntax',
    match: py(['rsa'], false),
    term: { en: 'rsa' },
    short: {
      en: 'The `cryptography` RSA module. `RSAPublicNumbers(e, n).public_key()` builds a public key from a JWK modulus and exponent.',
    },
  },
  {
    id: 'syntax.py.RSAPublicNumbers',
    kind: 'syntax',
    match: py(['rsa.RSAPublicNumbers', 'RSAPublicNumbers'], false),
    term: { en: 'RSAPublicNumbers' },
    short: {
      en: 'Holds an RSA public exponent `e` and modulus `n`. Calling `.public_key()` turns those two integers into a key object.',
    },
  },
  {
    id: 'syntax.py.public_key',
    kind: 'syntax',
    match: py(['public_key'], false),
    term: { en: 'public_key' },
    short: {
      en: 'Builds an RSA public key from `RSAPublicNumbers`. Algorithm-confusion labs then export it as PEM and use those bytes as an HMAC secret.',
    },
  },
  {
    id: 'syntax.py.public_bytes',
    kind: 'syntax',
    match: py(['public_bytes'], false),
    term: { en: 'public_bytes' },
    short: {
      en: 'Serializes a public key to `bytes`. With PEM encoding this is the `-----BEGIN PUBLIC KEY-----` block that HS256 labs misuse as the HMAC key.',
    },
  },
  {
    id: 'syntax.py.Encoding.PEM',
    kind: 'syntax',
    match: py(['serialization.Encoding.PEM', 'Encoding.PEM'], false),
    term: { en: 'Encoding.PEM' },
    short: {
      en: 'Tells `public_bytes` to emit PEM (Base64 with `BEGIN` / `END` banners) instead of raw DER. That textual form is what gets reused as an HMAC secret.',
    },
  },
  {
    id: 'syntax.py.SubjectPublicKeyInfo',
    kind: 'syntax',
    match: py(
      ['serialization.PublicFormat.SubjectPublicKeyInfo', 'PublicFormat.SubjectPublicKeyInfo', 'SubjectPublicKeyInfo'],
      false,
    ),
    term: { en: 'SubjectPublicKeyInfo' },
    short: {
      en: 'The X.509 SPKI layout for a public key: algorithm identifier plus the key bits. Combined with PEM encoding, it is the usual `BEGIN PUBLIC KEY` document.',
    },
  },
]
