const { fork } = require("child_process") // fork is a function that creates a new child process

// POST /admin/jobs endpoint handler
async function runAdminJobs(req, res) {
  const results = []

  for (const name of req.body.tasks) { // iterate over the tasks sent in the request body
    const options = { cwd: __dirname } // set the current working directory to the directory of the script

    const child = fork(`./tasks/${name}.js`, [], options) // on older node versions execArgv is inherited here in the options parameter this is the vector for RCE
    
    const result = await new Promise((resolve) => { // run the actual task
      const timer = setTimeout(() => { // set a timeout of 5 seconds to resolve the promise and kill the process if it takes too long

        child.kill()
        
        resolve({ name, success: false, error: { message: "Timed out waiting for task to complete." } })
      }, 5000)

      child.on("exit", (code) => { // if the execution flow reaches this point, it means the task finished before the timeout
        
        clearTimeout(timer) // clear the 5 second timer we set earlier
        
        resolve(code === 0 // if the exit code is 0, return a success object otherwise return an error object
          ? { name, success: true, message: "Child process executed successfully" }
          : { name, success: false, error: { code, message: "Unexpected error." } }
        )
      })
    })

    results.push(result) // add the result to the results array
  }

  res.json({ results }) // send the results as a JSON response
}
