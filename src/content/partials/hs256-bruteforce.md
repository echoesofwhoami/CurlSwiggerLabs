### What is HS256 (HMAC-SHA256)?

HS256 is a **symmetric** signing algorithm, meaning the same secret key is used to both sign and verify the token. This is different from asymmetric algorithms like RS256, which use a private key to sign and a public key to verify.

The security of HS256 depends entirely on the secrecy and strength of the key. If the key is weak (like "secret", "password", or "secret1"), it can be brute-forced.

### Why is Brute-forcing Possible?

Since the signature is deterministic (same input + same key = same signature), an attacker can:
1. Take the JWT's header and payload
2. Try signing it with different secret keys from a wordlist
3. Compare the generated signature with the original
4. When they match, the secret key has been found

This is only feasible when the secret is weak and exists in common wordlists.
