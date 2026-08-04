---
---

### Node.js `execArgv` as a Gadget

When you start Node yourself, you can pass CLI flags before the script:

```bash
node --inspect app.js
node --require ./preload.js app.js
node --eval "console.log(1)"
```

Those flags change how the Node process boots: enable the debugger, preload a module, or run inline JavaScript with `--eval` / `-e`.

`child_process.fork()` and `spawn()` can pass the same kind of flags to a **child** Node process through an options field named `execArgv`. It is just an array of strings, for example `["--inspect"]` or `["--eval=console.log(1)"]`.

```js
const { fork } = require("child_process")

fork("./worker.js", [], {
  execArgv: ["--eval=console.log('child boot')"]
})
```

If application code builds an options object and never sets its own `execArgv`, a normal property read still walks the prototype chain:

```js
const options = {}

options.execArgv // undefined

Object.prototype.execArgv = ["--eval=console.log('polluted')"]

options.execArgv // ["--eval=console.log('polluted')"]
```

After pollution, `fork(script, args, options)` can start the child with attacker-controlled Node flags. `--eval` is the interesting one: the child runs arbitrary JavaScript during startup. From that JavaScript you can call `require("child_process").execSync(...)` and run OS commands.

So the gadget is not "fork is always RCE". The gadget is: **pollute `execArgv`, then hit any code path that uses `fork` or `spawn` with an options object that inherits your value.**
