import type { Heading } from '@types'
import { listShikiThemes } from '../styles/shiki-themes'

const sampleBash = `curl -s "https://<lab-url>.web-security-academy.net/login" \\
  -H "Cookie: session=<session>" \\
  -d "username=wiener&password=peter"`

const samplePython = `import base64
import hashlib
import hmac

SECRET = b"<signing-key>"

def forge_token(header: str, payload: str) -> str:
    """Sign a forged JWT with a weak key."""
    signing_input = f"{header}.{payload}".encode()
    # HMAC-SHA256 over the signing input
    sig = hmac.new(SECRET, signing_input, hashlib.sha256).digest()
    return f"{header}.{payload}.{base64.urlsafe_b64encode(sig).rstrip(b'=').decode()}"

print(forge_token("<header>", "<payload>"))`

const previewHeadings: Heading[] = [
  { depth: 2, slug: 'preview-writeup', text: 'Writeup' },
  { depth: 3, slug: 'preview-request', text: 'The request' },
  { depth: 3, slug: 'preview-script', text: 'The script' },
]

export function themeTweakerPreview() {
  return {
    shikiThemes: listShikiThemes(),
    sampleBash,
    samplePython,
    previewHeadings,
  }
}
