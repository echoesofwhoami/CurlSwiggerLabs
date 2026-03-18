### Vulnerabilidad de Firma JWT No Verificada

Cuando un servidor recibe un JWT, debería **siempre verificar la firma** antes de confiar en el contenido del token. Sin embargo, algunas implementaciones no lo hacen correctamente.

La especificación JWT es flexible. Define cómo los tokens deben estar estructurados y firmados, pero la verificación real de la firma queda a cargo del código de la aplicación. Esto crea una brecha peligrosa: **si el servidor solo decodifica el JWT sin verificar la firma, un atacante puede modificar el payload a voluntad**.

**Cómo funciona el ataque:**

```
1. El atacante inicia sesión y recibe un JWT válido
2. El atacante decodifica el payload del JWT (base64)
3. El atacante modifica el payload (ej., cambia "sub": "wiener" a "sub": "administrator")
4. El atacante re-codifica el payload (base64)
5. El atacante envía el JWT modificado y el servidor lo acepta sin verificar la firma
```

El **header y la firma del token pueden permanecer completamente intactos** solo el payload necesita ser modificado.

**Ataque alternativo: Cambiar el algoritmo a "none"**

Algunas implementaciones JWT también aceptan el algoritmo `"none"`, que deshabilita completamente la verificación de firma. Los atacantes pueden:

```
1. Cambiar el "alg" del header de "RS256" o "HS256" a "none"
2. Eliminar completamente la parte de la firma (o mantener cualquier valor)
3. El servidor acepta el token sin ninguna validación de firma
```

Esto crea un token como: `header.payload.` (sin firma) o `header.payload.firma_invalida`.

**¿Por qué sucede esto?**

- Las librerías frecuentemente proporcionan métodos separados para **decodificar** y **verificar** JWTs
- Un desarrollador podría accidentalmente usar `decode()` en lugar de `verify()`, lo cual omite la validación de la firma
- La aplicación confía ciegamente en el token una vez que puede parsear la estructura JSON
- Algunas librerías aceptan el algoritmo `"none"` para tokens sin firmar, diseñado para casos de uso específicos pero peligroso si no está adecuadamente restringido
