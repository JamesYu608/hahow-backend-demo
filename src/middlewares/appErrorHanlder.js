// This middleware is used to handle all app errors
// No matter where the errors come from, we only handle them and response to user here

const AppError = require('../utils/AppError')

function appErrorHandler (err, req, res, next) {
  const isOperationalError = AppError.handler(err)
  if (isOperationalError) {
    // Known issue, just return error response to user
    res.status(err.code)
      .json({
        code: err.code,
        message: err.message
      })
  } else {
    // [DANGEROUS] Unknown issue occurred!
    // it might lead to an unpredicted behavior if we keep the service running

    // do something to gracefully restart the service
    process.exit(1)
  }
}

module.exports = appErrorHandler
