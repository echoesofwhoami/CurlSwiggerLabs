### JWT Unverified Signature Vulnerability

When a server receives a JWT, it should **always verify the signature** before trusting the token's contents. However, some implementations fail to do this properly.

The JWT specification is flexible. It defines how tokens should be structured and signed, but the actual signature verification is left to the application's code. This creates a dangerous gap: **if the server only decodes the JWT without verifying the signature, an attacker can modify the payload at will**.

**How the attack works:**

```
1. Attacker logs in and receives a valid JWT
2. Attacker decodes the JWT payload (base64)
3. Attacker modifies the payload (e.g., changes "sub": "wiener" to "sub": "administrator")
4. Attacker re-encodes the payload (base64)
5. Attacker sends the modified JWT to the server, which accepts it without checking the signature
```

The token's **header and signature can remain completely untouched** only the payload needs to be modified.

**Alternative attack: Changing algorithm to "none"**

Some JWT implementations also accept the `"none"` algorithm, which completely disables signature verification. Attackers can:

```
1. Change the header's "alg" from "RS256" or "HS256" to "none"
2. Remove the signature part entirely (or keep any value)
3. The server accepts the token without any signature validation
```

This creates a token like: `header.payload.` (no signature) or `header.payload.invalid_signature`.

**Why does this happen?**

- Libraries often provide separate methods for **decoding** and **verifying** JWTs
- A developer might accidentally use `decode()` instead of `verify()`, which skips signature validation
- The application trusts the token blindly once it can parse the JSON structure
- Some libraries accept the `"none"` algorithm for unsigned tokens, intended for specific use cases but dangerous if not properly restricted
