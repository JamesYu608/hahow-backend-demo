// This is our customized error class which extends built-in error class
// So we can distinguish app errors (expected) and other errors (unexpected)
// Besides, instead of throwing new errors everywhere, we extract common errors and create them in the same way

class AppError extends Error {
  constructor (name, code, message, logMessage = 'No additional information', isOperational = true) {
    super()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }

    this.name = name
    this.code = code
    this.message = message || name
    this.logMessage = logMessage
    this.isOperational = isOperational
  }

  // Common Errors:
  static badRequest (message, logMessage) {
    return new AppError('Bad request', 400, message, logMessage)
  }

  static notFound (message, logMessage) {
    return new AppError('Not found', 404, message, logMessage)
  }

  static badImplementation (message = 'An internal server error occurred', logMessage = '') {
    return new AppError('Bad implementation', 500, message, logMessage)
  }
}

module.exports = AppError
