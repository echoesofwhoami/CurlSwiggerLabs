---
---

### ¿Qué es la Serialización?

La serialización es el proceso de convertir un objeto (una estructura de datos en memoria) a un formato que puede ser almacenado o transmitido, como una cadena. La deserialización es lo opuesto: convertir esa cadena de vuelta a un objeto. En PHP, esto se hace con `serialize()` y `unserialize()`.

Por ejemplo, un objeto PHP como:
```php
$user = new User();
$user->username = "wiener";
$user->access_token = "abc123";
```

Se serializa a:
```
O:4:"User":2:{s:8:"username";s:6:"wiener";s:12:"access_token";s:6:"abc123";}
```

Desglosando el formato:
- `O:4:"User"` — **O**bjeto de nombre de clase de longitud **4**, llamado **"User"**
- `:2:` — tiene **2** propiedades
- `s:8:"username"` — nombre de propiedad de tipo **s**tring de longitud **8**: **"username"**
- `s:6:"wiener"` — valor de tipo **s**tring de longitud **6**: **"wiener"**

Cuando una aplicación almacena objetos serializados en cookies (como tokens de sesión), un atacante puede manipularlos. Si el servidor deserializa ciegamente la entrada controlada por el usuario, reconstruirá cualquier objeto que el atacante proporcione.
