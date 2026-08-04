// unsafe merge function
function merge(target, source) {
  for (let key in source) {
    if (typeof source[key] === 'object') {
      merge(target[key], source[key])
    } else {
      target[key] = source[key] // Unsafe assignment
    }
  }
  return target
}

// POST /my-account/change-address endpoint handler
async function changeAddress(req, res) {
  const user = await User.findById(req.auth.user.id) // retrieve the user from the database

  merge(user.address, req.body) // The unsafe merge reads the "__proto__" key and writes into Object.prototype.

  await User.update(user) // update the user in the database
  
  res.json(user.address) // return the updated user address
}
