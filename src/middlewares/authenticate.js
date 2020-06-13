// This middleware is used to identify the request is from a guest or a member
// Authenticate user when both name and password are in the headers
// if success, set req.isAuthenticated to true and continue routing

async function authenticate (req, res, next) {
  const { name, password } = req.headers
  if (name && password) {
    // TODO: authenticate
    req.isAuthenticated = true
  } else {
    req.isAuthenticated = false
  }
  next()
}

module.exports = authenticate
