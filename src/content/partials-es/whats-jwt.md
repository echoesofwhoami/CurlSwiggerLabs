### ¿Qué es JWT (JSON Web Token)?

JWT es un medio compacto y seguro para URLs de representar **Claims*** que se transfieren entre dos partes. Se usa comúnmente para autenticación e intercambio de información en aplicaciones web. Usa codificación base64 para asegurar transmisión segura para URLs.

Un JWT consta de tres partes separadas por puntos (`.`):

```
header.payload.signature
```

Por ejemplo:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3aWVuZXIiLCJleHAiOjE3NzIxOTg5NTd9.signature_here
```

Desglosando cada parte:

**1. Header** (JSON codificado en Base64URL):
```json
{
  "kid": "170c351e-58cc-4e4b-9116-6e7924337580",
  "alg": "HS256"
}
```
- `alg`: El algoritmo de firma (HS256 = HMAC-SHA256)
- `kid`: Key ID (identificador opcional para la clave de firma)

**2. Payload** (JSON codificado en Base64URL):
```json
{
  "iss": "portswigger",
  "exp": 1772198957,
  "sub": "wiener"
}
```
- `iss`: Emisor del token
- `exp`: Timestamp de expiración
- `sub`: Subject (usualmente el nombre de usuario)

**3. Signature**:
La firma se crea tomando el header y payload codificados, y firmandolos con una clave secreta usando el algoritmo especificado en el header:

```
# Pseudocódigo

message = base64UrlEncode(header) + "." + base64UrlEncode(payload) 

key = JWT_SECRET # Podría ser una contraseña, API key, UUID o cualquier otra cadena

signature = HMACSHA256(message, key)  # Esto es solo la parte de la firma, no el JWT completo
```

La firma asegura que el token no ha sido manipulado. Si un atacante modifica el header o payload, la firma no coincidirá a menos que conozca la clave secreta.

**El JWT completo se construiría así:**

```
# Pseudocódigo

jwt = base64UrlEncode(header) + "." + base64UrlEncode(payload) + "." + signature
```
