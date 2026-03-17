### ¿Qué es Server-Side Request Forgery (SSRF)?

Server-Side Request Forgery (SSRF) es una vulnerabilidad que permite a un atacante hacer que la aplicación del lado del servidor envíe peticiones HTTP a un dominio arbitrario de elección del atacante. Esto puede usarse para:

- **Acceder a servicios internos** que no están expuestos directamente a internet
- **Evadir autenticación** accediendo a interfaces de administración internas
- **Leer archivos sensibles** de sistemas internos
- **Extraer datos** de bases de datos o APIs internas

**Cómo funciona SSRF:**
1. La aplicación acepta una URL como parámetro (ejemplo: `?url=https://example.com`)
2. El servidor hace una petición HTTP a esa URL
3. El servidor procesa la respuesta (SSRF ciego) o la devuelve al usuario (SSRF no ciego)
4. Un atacante reemplaza la URL con una dirección interna (ejemplo: `http://localhost/admin`)

**Objetivos comunes para SSRF:**
- `localhost` o `127.0.0.1` - el propio servidor
- `192.168.x.x` o `10.x.x.x` - rangos de red interna
- `169.254.x.x` - servicio de metadatos de AWS
- APIs internas, bases de datos, o paneles de administración
