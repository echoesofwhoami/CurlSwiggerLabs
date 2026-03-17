---
---

### ¿Qué son los Métodos Mágicos de PHP?

PHP tiene métodos especiales llamados **métodos mágicos** que son invocados automáticamente en ciertos puntos del ciclo de vida de un objeto. Siempre comienzan con doble guion bajo (`__`). Los más relevantes para ataques de deserialización son:

- `__construct()` — llamado cuando un objeto es **creado** (`new ClassName()`)
- `__destruct()` — llamado cuando un objeto es **destruido** (sale del ámbito, termina el script, o es ejecutado por un garbage collector)
- `__wakeup()` — llamado cuando un objeto es **deserializado** (`unserialize()`)
- `__toString()` — llamado cuando un objeto es tratado como una **cadena**

El peligroso aquí es `__destruct()`. Cuando PHP deserializa un objeto de una cookie, crea ese objeto en memoria. Cuando la petición termina de procesarse, el recolector de basura de PHP destruye el objeto, lo que **activa automáticamente `__destruct()`**. El atacante no necesita llamarlo — PHP lo hace por ellos.
