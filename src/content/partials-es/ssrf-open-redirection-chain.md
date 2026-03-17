### Ataque Encadenado: Redirección Abierta + SSRF

Cuando una aplicación puede hacer peticiones arbitrarias con protecciones SSRF y también tiene una vulnerabilidad de redirección abierta, los atacantes pueden encadenarlas para evadir los filtros SSRF:

**Ejemplo de flujo de ataque:**
1. **La protección SSRF bloquea**: `http://localhost/admin` - las URLs internas directas son filtradas
2. **Pero permite**: `https://<victim-domain>/redirect?url=http://localhost/admin` - los dominios externos (dominio de la víctima) pasan la validación
3. **La redirección abierta redirige**: El sitio de la víctima redirige la petición al objetivo interno ya que se hace del lado del servidor
4. **Resultado**: SSRF a la interfaz de administración interna evadido a través de redirección de petición haciendo la petición interna

**Por qué esto funciona:**
- El filtro SSRF solo verifica si la URL inicial es "segura" (dominio externo)
- No sigue las redirecciones para ver el destino final
- La vulnerabilidad de redirección abierta actúa como un proxy para alcanzar objetivos internos
