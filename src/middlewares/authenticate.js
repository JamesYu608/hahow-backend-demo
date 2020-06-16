// This middleware is used to identify the request is from a guest or a member
// Authenticate user when both name and password are in the headers
// if success, set req.isAuthenticated to true and continue routing

const hahowAPI = require('../services/hahowAPI')

async function authenticate (req, res, next) {
  req.isAuthenticated = false

  const { name, password } = req.headers
  if (name && password) {
    if (await hahowAPI.authenticate(name, password)) {
      req.isAuthenticated = true
    }
  }
  next()
}

module.exports = authenticate
