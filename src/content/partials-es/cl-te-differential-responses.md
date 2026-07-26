### Smuggling CL.TE y respuestas diferenciales

En una vulnerabilidad **CL.TE** el front-end confía en `Content-Length` mientras el back-end confía en `Transfer-Encoding: chunked`.

Una petición de smuggling mínima se ve así:

```http
POST / HTTP/1.1
Host: vulnerable-website.com
Content-Length: 13
Transfer-Encoding: chunked

0

SMUGGLED
```

Lo que ve cada servidor:

1. **Front-end (CL):** el body son 13 bytes, así que reenvía todo hasta `SMUGGLED`
2. **Back-end (TE):** ve chunk de tamaño `0`, así que la petición termina al instante; los bytes sobrantes `SMUGGLED` quedan en el buffer del socket
3. Esos bytes se anteponen a la siguiente petición que llegue por esa conexión back-end

#### Confirmar con respuestas diferenciales

Los retrasos de tiempo pueden *sugerir* smuggling, pero una prueba más fuerte es forzar una **respuesta distinta** a la que daría una petición normal.

El patrón habitual:

1. Enviar una petición de **ataque** que introduzca `GET /404 HTTP/1.1...` en el buffer del back-end
2. Enviar de inmediato una segunda petición (idealmente en una **conexión de cliente distinta**, misma URL para que el balanceo siga golpeando el mismo back-end)
3. Si la segunda respuesta es `404 Not Found` en lugar del `200 OK` normal de `/`, el prefijo se aplicó y CL.TE queda confirmado

Tras un smuggle exitoso, el back-end procesa algo como:

```http
GET /404 HTTP/1.1
X-Ignore: XPOST / HTTP/1.1
Host: ...
...
```

`X-Ignore` (o cualquier header dummy) absorbe el inicio de la petición real siguiente para que el parseo de headers no falle antes de evaluar la ruta `/404`.
