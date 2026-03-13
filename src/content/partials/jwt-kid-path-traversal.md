### What is the `kid` Header Parameter?

The `kid` (Key ID) is an optional header parameter in a JWT that tells the server **which key to use** to verify the token's signature. This is useful when a server manages multiple signing keys.

```json
{
  "kid": "dade186d-6d19-4584-ab27-737975e1611f",
  "alg": "HS256"
}
```

The server receives the JWT, reads the `kid` value, and uses it to look up the corresponding signing key. The implementation of this lookup varies. Some servers use a database, others use the filesystem.

### Path Traversal via `kid`

When the server fetches the signing key **from the filesystem** using the `kid` value, it becomes vulnerable to **directory traversal** if the input is not sanitized. An attacker can manipulate `kid` to point to any file with known contents:

```json
{
  "kid": "../../../../../../../dev/null",
  "alg": "HS256"
}
```

On Linux, `/dev/null` is a special file that always returns **empty content**. By pointing `kid` to it, the server will use an **empty string** as the signing key. The attacker can then sign their forged JWT with an empty string, and the server will accept it as valid.
