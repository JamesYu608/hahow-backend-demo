// All service config is here, including database config, 3rd-party API URLs, credentials, etc.
// Generally, they will be setup at runtime or written in .env file, then loaded by a config library likes dotenv
// But in this demo project, they are HARDCODE here so I don't have to provide another "secret" file :D

const { validate } = require('./schema')

const config = {
  PORT: 8080,
  DATA_SOURCE: {
    HAHOW: {
      API_URL: 'https://hahow-recruit.herokuapp.com'
    }
  }
}

if (!validate(config)) {
  const errorMessage = validate.errors.map(e => e.message).join('\n')
  throw new Error(errorMessage)
}

module.exports = config
