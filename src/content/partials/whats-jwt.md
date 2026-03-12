### What is JWT (JSON Web Token)?

JWT is a compact, URL-safe means of representing **Claims\*** to be transferred between two parties. It's commonly used for authentication and information exchange in web applications. It uses base64 encoding to ensure URL-safe transmission.

A JWT consists of three parts separated by dots (`.`):

```
header.payload.signature
```

For example:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3aWVuZXIiLCJleHAiOjE3NzIxOTg5NTd9.signature_here
```

Breaking down each part:

**1. Header** (Base64URL encoded JSON):
```json
{
  "kid": "170c351e-58cc-4e4b-9116-6e7924337580",
  "alg": "HS256"
}
```
- `alg`: The signing algorithm (HS256 = HMAC-SHA256)
- `kid`: Key ID (optional identifier for the signing key)

**2. Payload** (Base64URL encoded JSON):
```json
{
  "iss": "portswigger",
  "exp": 1772198957,
  "sub": "wiener"
}
```
- `iss`: Issuer of the token
- `exp`: Expiration timestamp
- `sub`: Subject (usually the username)

**3. Signature**:
The signature is created by taking the encoded header and payload, and signing them with a secret key using the algorithm specified in the header:

```
# Pseudocode

message = base64UrlEncode(header) + "." + base64UrlEncode(payload) 

key = JWT_SECRET # It could be a password, API key, UUID, or any other string

signature = HMACSHA256(message, key)  # This is just the signature part, not the complete JWT
```

The signature ensures that the token hasn't been tampered with. If an attacker modifies the header or payload, the signature won't match unless they know the secret key.

**The complete JWT would be constructed as:**

```
# Pseudocode

jwt = base64UrlEncode(header) + "." + base64UrlEncode(payload) + "." + signature
```
