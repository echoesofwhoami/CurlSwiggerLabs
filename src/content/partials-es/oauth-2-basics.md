### ¿Qué es OAuth 2.0?

OAuth 2.0 es un marco de autorización (framework) que permite a aplicaciones de terceros acceder a los recursos de un usuario sin exponer sus credenciales. En lugar de compartir contraseñas, OAuth usa **códigos de autorización** y **tokens de acceso** para otorgar acceso limitado.

**Piensa en OAuth como darle a alguien una llave de valet temporal para tu coche:**

- **Sin OAuth**: Le das a alguien tu llave principal del coche (contraseña). Pueden conducir tu coche, abrir el maletero, acceder a la guantera. Básicamente todo. Si la pierden o la roban, tienen acceso completo a tu coche.

- **Con OAuth**: Les das una llave de valet especial (token de acceso) que solo abre la puerta del conductor y arranca el motor. No pueden acceder al maletero o guantera. La llave expira después de poco tiempo, y solo funciona para coches específicos (permisos limitados).

Las partes clave en un flujo OAuth son:

- **Resource Owner**: El usuario que posee los datos (ej., el admin)
- **Client Application**: El sitio web que quiere acceder a los datos del usuario (ej., el blog)
- **OAuth Provider (Authorization Server)**: El servicio que autentica al usuario y emite tokens (ej., el servidor de login de redes sociales)

**Ejemplo real**: Cuando haces clic en "Iniciar sesión con Google" en un sitio web, ese sitio web es la Client Application, Google es el OAuth Provider, y tú eres el Resource Owner. El sitio web nunca ve tu contraseña de Google. Solo obtiene un token temporal para acceder a información básica del perfil.

### El Flujo de Código de Autorización

El flujo OAuth más común funciona así:

**Desglose paso a paso:**

1. **Usuario hace clic en "Iniciar sesión con Redes Sociales"** en la aplicación cliente (ej., hacer clic en "Iniciar sesión con Google" en un blog)

2. **La aplicación cliente redirige al usuario** al endpoint /auth del proveedor OAuth con varios parámetros:
   - `client_id`: identifica la aplicación cliente (como "este es el sitio web del blog")
   - `redirect_uri`: dónde enviar al usuario después de la autorización (como "enviarlo de vuelta a https://<blog>.com/oauth-callback")
   - `response_type=code`: solicita un código de autorización (no acceso directo)
   - `scope`: qué permisos se solicitan (como "solo necesito tu email y foto de perfil")

3. **Usuario se autentica** con el proveedor OAuth (ingresa sus credenciales de Google/Facebook)

4. **Usuario consiente** los permisos solicitados (ve una pantalla como "¿Permitir que este blog acceda a tu email y perfil?")

5. **El proveedor OAuth redirige al usuario** de vuelta al `redirect_uri` con un código de autorización:
   ```
   https://<blog>.com/oauth-callback?code=XYZ123ABC
   ```
   Esto es como obtener un recibo que dice "el usuario aprobó esta solicitud"

6. **La aplicación cliente intercambia el código por un token de acceso** (del lado del servidor, el blog envía el código de vuelta a Google diciendo "aquí está el recibo, ahora dame la llave real")

7. **La aplicación cliente usa el token de acceso** para acceder a los recursos del usuario (el blog ahora puede obtener la información del perfil del usuario de Google usando la llave temporal)

**¿Por qué este proceso de dos pasos?** El código de autorización es de corta duración y de un solo uso. Incluso si un atacante lo intercepta, solo puede usarlo una vez y expira rápidamente. El token de acceso es lo que realmente otorga acceso, pero se envia entre servidores, nunca expuesto al navegador del usuario.
