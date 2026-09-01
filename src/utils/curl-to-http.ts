/**
 * curl-to-http.ts
 *
 * Converts a bash curl command (possibly multi-line with \ continuations)
 * into a raw HTTP/1.1 wire-format representation for display purposes.
 *
 * Returns null when the input is not a curl command or cannot be parsed
 * into a meaningful HTTP representation.
 */

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Collapse backslash-newline continuations and trim. */
function joinContinuations(cmd: string): string {
  return cmd.replace(/\\\n[ \t]*/g, ' ').trim();
}

/**
 * Return the portion of `s` that comes before the first unquoted `|`.
 * Handles single-quoted, double-quoted, and $'...' strings.
 */
function extractBeforePipe(s: string): string {
  let inSingle = false;
  let inDouble = false;
  let inAnsiC = false; // $'...'

  for (let i = 0; i < s.length; i++) {
    const c = s[i];

    if (inAnsiC) {
      if (c === '\\') { i++; continue; } // skip escaped char
      if (c === "'") inAnsiC = false;
      continue;
    }

    if (inSingle) {
      if (c === "'") inSingle = false;
      continue;
    }

    if (inDouble) {
      if (c === '\\') { i++; continue; }
      if (c === '"') inDouble = false;
      continue;
    }

    // Unquoted context
    if (c === '$' && s[i + 1] === "'") { inAnsiC = true; i++; continue; }
    if (c === "'") { inSingle = true; continue; }
    if (c === '"') { inDouble = true; continue; }
    if (c === '|') return s.slice(0, i);
  }
  return s;
}

/**
 * Tokenise a shell command fragment into an array of strings, honouring
 * double-quotes, single-quotes, and bash $'…' ANSI-C quoting.
 */
function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  const n = input.length;

  while (i < n) {
    // skip whitespace
    while (i < n && /\s/.test(input[i])) i++;
    if (i >= n) break;

    let token = '';

    if (input[i] === '$' && input[i + 1] === "'") {
      // $'...' ANSI-C quoting
      i += 2;
      while (i < n && input[i] !== "'") {
        if (input[i] === '\\' && i + 1 < n) {
          i++;
          switch (input[i]) {
            case 'r':  token += '\r'; break;
            case 'n':  token += '\n'; break;
            case 't':  token += '\t'; break;
            case '0':  token += '\0'; break;
            default:   token += input[i];
          }
        } else {
          token += input[i];
        }
        i++;
      }
      i++; // closing '
    } else if (input[i] === '"') {
      i++;
      while (i < n && input[i] !== '"') {
        if (input[i] === '\\' && i + 1 < n) { i++; token += input[i]; }
        else token += input[i];
        i++;
      }
      i++; // closing "
    } else if (input[i] === "'") {
      i++;
      while (i < n && input[i] !== "'") { token += input[i++]; }
      i++; // closing '
    } else {
      // unquoted — read until whitespace
      while (i < n && !/\s/.test(input[i])) { token += input[i++]; }
    }

    tokens.push(token);
  }

  return tokens;
}

/** Extract `{ host, path }` from a URL string that may contain <placeholders>
 *  or shell variable references like `$BASE_LAB_URL/path`. */
function parseUrlParts(url: string): { host: string; path: string } | null {
  // Standard https?:// URL (possibly with <placeholder> segments)
  const absolute = url.match(/^https?:\/\/([^/]+)(\/[^]*)?$/);
  if (absolute) return { host: absolute[1], path: absolute[2] ?? '/' };

  // Shell variable URL: $VAR/path  or  ${VAR}/path
  const shellVar = url.match(/^(\$\{?[A-Za-z_][A-Za-z0-9_]*\}?)(\/[^]*)?$/);
  if (shellVar) return { host: shellVar[1], path: shellVar[2] ?? '/' };

  return null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface HttpConversion {
  /** The raw HTTP request as a plain string ready for display. */
  raw: string;
}

/**
 * Parse `curlCmd` and return an `HttpConversion`, or `null` when the command
 * is not a recognisable curl invocation that can be meaningfully displayed.
 *
 * @param env  Optional map of shell variable names → values collected from
 *             sibling scripts in the same lab directory (e.g. BASE_LAB_URL).
 *             Any `$VAR` / `${VAR}` reference in the command is expanded
 *             before parsing so the raw HTTP output shows real host/paths.
 */
export function curlToHttp(curlCmd: string, env: Record<string, string> = {}): HttpConversion | null {
  const joined = joinContinuations(curlCmd);

  // Expand shell variables collected from sibling env scripts.
  const expanded = Object.keys(env).length
    ? joined.replace(
        /\$\{?([A-Za-z_][A-Za-z0-9_]*)\}?/g,
        (full, name) => (name in env ? env[name] : full),
      )
    : joined;

  // Must start with the `curl` command
  if (!/^curl\b/.test(expanded)) return null;

  const afterCurl = expanded.slice(4); // everything after "curl"
  const curlPart = extractBeforePipe(afterCurl);
  const tokens = tokenize(curlPart.trim());

  let method: string | undefined;
  let url: string | undefined;
  const headers: [string, string][] = [];
  let body: string | undefined;
  let cookieHeader: string | undefined;

  // Flags whose value argument we skip (no useful HTTP representation)
  const SKIP_WITH_VALUE = new Set([
    '-D', '--dump-header',
    '-o', '--output',
    '-m', '--max-time',
    '--connect-timeout',
    '--cacert', '--cert', '--key',
    '--proxy', '-x',
    '--limit-rate',
    '--retry',
  ]);

  // Flags that are self-contained (no value)
  const SKIP_SOLO = new Set([
    '-s', '--silent',
    '-S', '--show-error',
    '-i', '--include',
    '-v', '--verbose',
    '-L', '--location',
    '-k', '--insecure',
    '--http1.1',
    '--http1.0',
    '--http2',
    '--http2-prior-knowledge',
    '--compressed',
    '--no-keepalive',
    '--fail',
    '-f',
    '-g', '--globoff',
    '-n', '--netrc',
    '--ntlm',
    '--digest',
    '--anyauth',
  ]);

  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];

    if (tok === '-X' || tok === '--request') {
      method = tokens[++i];
    } else if (tok === '-H' || tok === '--header') {
      const raw = tokens[++i];
      const colon = raw.indexOf(':');
      if (colon !== -1) {
        headers.push([raw.slice(0, colon).trim(), raw.slice(colon + 1).trim()]);
      }
    } else if (tok === '-b' || tok === '--cookie') {
      cookieHeader = tokens[++i];
    } else if (tok === '-d' || tok === '--data' || tok === '--data-raw') {
      body = tokens[++i];
      method ??= 'POST';
    } else if (tok === '--data-binary') {
      body = tokens[++i];
      method ??= 'POST';
    } else if (tok === '--data-urlencode') {
      const val = tokens[++i];
      // val may be "key=value" or just "value" — keep as-is for display
      body = body ? `${body}&${val}` : val;
      method ??= 'POST';
    } else if (tok === '-u' || tok === '--user') {
      const creds = tokens[++i];
      const b64 = Buffer.from(creds, 'utf-8').toString('base64');
      headers.push(['Authorization', `Basic ${b64}`]);
    } else if (tok === '-A' || tok === '--user-agent') {
      headers.push(['User-Agent', tokens[++i]]);
    } else if (tok === '-e' || tok === '--referer') {
      headers.push(['Referer', tokens[++i]]);
    } else if (tok === '--resolve') {
      i++; // skip "host:port:addr"
    } else if (SKIP_WITH_VALUE.has(tok)) {
      i++; // skip the value
    } else if (SKIP_SOLO.has(tok)) {
      // nothing
    } else if (tok.startsWith('-')) {
      // Unknown flag — if it looks like combined short flags (-si, -sD -)
      // try to handle gracefully; just skip it and its potential value on
      // next iteration only if the token looks like a flag group.
      // For truly unknown long flags with values we can't safely skip,
      // just ignore.
    } else if (!url) {
      url = tok;
    }

    i++;
  }

  if (!url) return null;

  const parts = parseUrlParts(url);
  if (!parts) return null;

  const finalMethod = method ?? (body !== undefined ? 'POST' : 'GET');

  // Build lines
  const lines: string[] = [];
  lines.push(`${finalMethod} ${parts.path} HTTP/1.1`);
  lines.push(`Host: ${parts.host}`);

  if (cookieHeader) {
    lines.push(`Cookie: ${cookieHeader}`);
  }

  for (const [name, value] of headers) {
    lines.push(`${name}: ${value}`);
  }

  if (body !== undefined) {
    // Add Content-Type only if not already provided via -H
    const hasContentType = headers.some(
      ([n]) => n.toLowerCase() === 'content-type',
    );
    if (!hasContentType) {
      lines.push('Content-Type: application/x-www-form-urlencoded');
    }

    // Compute byte length (body may contain \r\n from $'...' parsing)
    const bodyBytes = Buffer.byteLength(body, 'utf-8');
    lines.push(`Content-Length: ${bodyBytes}`);
  }

  lines.push(''); // mandatory blank line

  if (body !== undefined) {
    lines.push(body);
  }

  return { raw: lines.join('\n') };
}

/** True when the file name/extension indicates a shell script. */
export function isBashFile(file: string): boolean {
  return /\.(sh|bash)$/.test(file);
}
