### ¿Qué es un Ataque de Confusión de Algoritmo JWT?

La confusión de algoritmo JWT (también conocida como confusión de clave) explota servidores que usan algoritmos **asimétricos** como RS256 pero fallan en hacer cumplir el algoritmo esperado al verificar tokens.

**Cómo funciona normalmente RS256:**
- El servidor firma tokens con una **clave privada**
- El servidor verifica tokens con la **clave pública** correspondiente
- La clave pública a menudo se expone a través de un endpoint estándar como `/jwks.json`

**La vulnerabilidad:**

Cuando un servidor recibe un JWT, lee el header `alg` para determinar qué algoritmo usar para verificación. Si el servidor no hace cumplir estrictamente el algoritmo esperado, un atacante puede:

1. **Obtener la clave pública del servidor** (a menudo disponible en `/jwks.json` o `/.well-known/jwks.json`)
2. **Cambiar el header `alg`** de `RS256` a `HS256`
3. **Firmar el token** usando HMAC-SHA256 con la **clave pública como el secreto simétrico**

El servidor entonces ve `alg: HS256`, toma su "clave de verificación" (que es la clave pública RSA), y la usa como el secreto HMAC coincidiendo exactamente con la firma del atacante.

```
Flujo normal: RS256 -> verificar con clave pública (asimétrico)
Flujo de ataque: HS256 -> verificar con clave pública (usada como secreto simétrico)
```

Esto funciona porque el código de verificación del servidor genéricamente pasa su "clave" a cualquier algoritmo especificado, sin verificar que el algoritmo coincida con el tipo de clave.
