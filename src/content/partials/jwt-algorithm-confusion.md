### What is a JWT Algorithm Confusion Attack?

JWT algorithm confusion (also known as key confusion) exploits servers that use **asymmetric** algorithms like RS256 but fail to enforce the expected algorithm when verifying tokens.

**How RS256 normally works:**
- The server signs tokens with a **private key**
- The server verifies tokens with the corresponding **public key**
- The public key is often exposed via a standard endpoint like `/jwks.json`

**The vulnerability:**

When a server receives a JWT, it reads the `alg` header to determine which algorithm to use for verification. If the server doesn't strictly enforce the expected algorithm, an attacker can:

1. **Obtain the server's public key** (often available at `/jwks.json` or `/.well-known/jwks.json`)
2. **Change the `alg` header** from `RS256` to `HS256`
3. **Sign the token** using HMAC-SHA256 with the **public key as the symmetric secret**

The server then sees `alg: HS256`, picks its "verification key" (which is the RSA public key), and uses it as the HMAC secret exactly matching the attacker's signature.

```
Normal flow: RS256 -> verify with public key (asymmetric)
Attack flow: HS256 -> verify with public key (used as symmetric secret)
```

This works because the server's verification code generically passes its "key" to whatever algorithm is specified, without checking that the algorithm matches the key type.
