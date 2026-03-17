### ¿Qué es HS256 (HMAC-SHA256)?

HS256 es un algoritmo de firma **simétrico**, lo que significa que la misma clave secreta se usa tanto para firmar como para verificar el token. Esto es diferente de los algoritmos asimétricos como RS256, que usan una clave privada para firmar y una clave pública para verificar.

La seguridad de HS256 depende enteramente del secreto y la fuerza de la clave. Si la clave es débil (como "secret", "password", o "secret1"), puede ser forzada por fuerza bruta.

### ¿Por qué es Posible la Fuerza Bruta?

Dado que la firma es determinista (misma entrada + misma clave = misma firma), un atacante puede:
1. Tomar el header y payload del JWT
2. Intentar firmarlo con diferentes claves secretas de una lista de palabras
3. Comparar la firma generada con la original
4. Cuando coinciden, la clave secreta ha sido encontrada

Esto solo es factible cuando el secreto es débil y existe en listas de palabras comunes.
