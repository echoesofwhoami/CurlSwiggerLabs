### ¿Qué es el Parámetro Header `kid`?

El `kid` (Key ID) es un parámetro header opcional en un JWT que le dice al servidor **qué clave usar** para verificar la firma del token. Esto es útil cuando un servidor gestiona múltiples claves de firma.

```json
{
  "kid": "dade186d-6d19-4584-ab27-737975e1611f",
  "alg": "HS256"
}
```

El servidor recibe el JWT, lee el valor `kid`, y lo usa para buscar la clave de firma correspondiente. La implementación de esta búsqueda varía. Algunos servidores usan una base de datos, otros usan el sistema de archivos.

### Path Traversal vía `kid`

Cuando el servidor obtiene la clave de firma **del sistema de archivos** usando el valor `kid`, se vuelve vulnerable a **directory traversal** si la entrada no está saneada. Un atacante puede manipular `kid` para apuntar a cualquier archivo con contenido conocido:

```json
{
  "kid": "../../../../../../../dev/null",
  "alg": "HS256"
}
```

En Linux, `/dev/null` es un archivo especial que siempre devuelve **contenido vacío**. Al apuntar `kid` a él, el servidor usará una **cadena vacía** como clave de firma. El atacante puede entonces firmar su JWT forjado con una cadena vacía, y el servidor lo aceptará como válido.
