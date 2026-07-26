### ¿Qué es el HTTP Request Smuggling?

El HTTP request smuggling engaña a un sitio para que mezcle dónde termina una petición HTTP y dónde empieza la siguiente.

La mayoría de las apps están detrás de un front-end (proxy / balanceador) que reenvía el tráfico a un back-end. Por velocidad, el front-end suele enviar varias peticiones HTTP/1 por la misma conexión. Eso solo funciona si ambos servidores coinciden en dónde termina cada petición.

**Por qué HTTP/1 puede ser ambiguo:**

HTTP/1 tiene dos formas de decir cuánto dura el body:

1. **`Content-Length`**: tamaño exacto en bytes
2. **`Transfer-Encoding: chunked`**: body enviado en trozos, terminando con un chunk de tamaño cero (`0\r\n\r\n`)

Si ambos headers están presentes y no coinciden, un servidor puede usar `Content-Length` y el otro `Transfer-Encoding`. El atacante entonces puede esconder bytes extra que el back-end trata como el inicio de la *siguiente* petición.

**Variantes clásicas:**

| Variante | Front-end usa | Back-end usa |
|----------|---------------|--------------|
| **CL.TE** | `Content-Length` | `Transfer-Encoding` |
| **TE.CL** | `Transfer-Encoding` | `Content-Length` |
| **TE.TE** | Ambos soportan TE, pero uno se puede confundir con un header TE raro | |

**El impacto puede incluir:**

- Evadir controles de seguridad del front-end (las reglas del proxy nunca ven la petición interna escondida)
- Envenenar peticiones / respuestas de otros usuarios (los bytes sobrantes se pegan a la siguiente petición de otra persona)
- Robar credenciales, tokens o envenenar cachés (capturar o reescribir lo que otro usuario envía o recibe)
- Llegar a endpoints privilegiados (ej. esconder `GET /internal` para que el back-end lo vea mientras el front-end solo permitió `/`, saltándose rewrites de path o headers de auth que el front-end habría añadido)
