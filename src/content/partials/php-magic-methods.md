---
---

### What are PHP Magic Methods?

PHP has special methods called **magic methods** that are automatically invoked at certain points in an object's lifecycle. They always start with a double underscore (`__`). The most relevant ones for deserialization attacks are:

- `__construct()` — called when an object is **created** (`new ClassName()`)
- `__destruct()` — called when an object is **destroyed** (goes out of scope, script ends, or garbage collected)
- `__wakeup()` — called when an object is **deserialized** (`unserialize()`)
- `__toString()` — called when an object is treated as a **string**

The dangerous one here is `__destruct()`. When PHP deserializes an object from a cookie, it creates that object in memory. When the request finishes processing, PHP's garbage collector destroys the object, which **automatically triggers `__destruct()`**. The attacker doesn't need to call it — PHP does it for them.
