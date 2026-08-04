---
---

Most JavaScript objects have a link to a special object called its **prototype**

That link is not a copy of properties. It is a fallback: when you read a key that the object does not own, the engine looks for it on the prototype.

Each prototype can link to another one in turn. Those links form a **prototype chain**, which ends at `null`.

So a missing property is searched in this order:

1. the object itself (own properties)
2. its prototype
3. that prototype's prototype, and so on, until either finds it or finds `null` and returns the famous `undefined`

#### Prototype chain behavior examples
A lookup can walk more than one link. Here `user` inherits from `roleDefaults`, which still inherits from `Object.prototype`:

```js
const roleDefaults = {
  isAdmin: false
}

const user = {
  username: "carlos",
  __proto__: roleDefaults
}

console.log(user.username) // "carlos" (own)
console.log(user.isAdmin)  // false    (from roleDefaults)
console.log(user.toString) // [Function: toString] (from Object.prototype but was searched first in user and roleDefaults)

// The full chain:
// user -> roleDefaults -> Object.prototype -> null
```

#### A few more short examples

**Undefined property default behavior:**

```js
const user = {
  username: "carlos"
}

console.log(user.isAdmin) // undefined
```

**Undefined property but present on the prototype chain:**

```js
const user = {
  username: "carlos",
  __proto__: {
    isAdmin: true
  }
}

console.log(user.isAdmin) // true
```

**Priority of properties:** \
Own properties always win over inherited ones. If the object already has the key, the chain is not consulted

```js
const user = {
  username: "carlos",
  isAdmin: false,
  __proto__: {
    isAdmin: true
  }
}

console.log(user.isAdmin) // false
```
