---
---

### What is Serialization?

Serialization is the process of converting an object (a data structure in memory) into a format that can be stored or transmitted, like a string. Deserialization is the reverse: turning that string back into an object. In PHP, this is done with `serialize()` and `unserialize()`.

For example, a PHP object like:
```php
$user = new User();
$user->username = "wiener";
$user->access_token = "abc123";
```

Gets serialized into:
```
O:4:"User":2:{s:8:"username";s:6:"wiener";s:12:"access_token";s:6:"abc123";}
```

Breaking down the format:
- `O:4:"User"` — **O**bject of class name length **4**, named **"User"**
- `:2:` — has **2** properties
- `s:8:"username"` — **s**tring property name of length **8**: **"username"**
- `s:6:"wiener"` — **s**tring value of length **6**: **"wiener"**

When an application stores serialized objects in cookies (like session tokens), an attacker can tamper with them. If the server blindly deserializes user-controlled input, it will reconstruct whatever object the attacker provides.
