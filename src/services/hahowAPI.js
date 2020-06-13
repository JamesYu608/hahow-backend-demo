// All remote APIs are modularized and located under the /services folder
// Here are Hahow's APIs

const got = require('got')
const hahowConfig = require('../../config').DATA_SOURCE.HAHOW
const schema = require('./hahowAPISchema')
const logger = require('../utils/logger')
const AppError = require('../utils/AppError')

const HEROES_URL = `${hahowConfig.API_URL}/heroes`

// All remote API calls follow the same 4 steps
async function getAllHeroes () {
  const URL = HEROES_URL
  // Step 1: Send request to remote API
  let response
  try {
    response = await got.get(URL).json()
  } catch (e) {
    // Step 2: Check response status code is 200 or not
    throw responseStatusError('GET', URL, e)
  }

  // Step 3: Check response content is what we expect
  // e.g. status code: 200, but content is { code: 1000, message: 'Backend error' }
  if (!schema.getAllHeroesValidate(response)) {
    throw responseSchemaError('GET', URL, response)
  }

  // Step 4: Process response content
  return response.map(data => ({
    id: data.id,
    name: data.name,
    image: data.image
  }))
}

async function getHeroById (heroId) {
  const URL = `${HEROES_URL}/${heroId}`
  let response
  try {
    response = await got.get(URL).json()
  } catch (e) {
    // in this case, we treat 404 as a normal response, just return null
    if (e.response && e.response.statusCode === 404) {
      return null
    }
    // if not 404, it's still a remote API error
    throw responseStatusError('GET', URL, e)
  }

  if (!schema.getHeroByIdValidate(response)) {
    throw responseSchemaError('GET', URL, response)
  }

  return {
    id: response.id,
    name: response.name,
    image: response.image
  }
}

async function getHeroProfileById (heroId) {
  const URL = `${HEROES_URL}/${heroId}/profile`
  let response
  try {
    response = await got.get(URL).json()
  } catch (e) {
    if (e.response && e.response.statusCode === 404) {
      return null
    }
    throw responseStatusError('GET', URL, e)
  }

  if (!schema.getHeroProfileByIdValidate(response)) {
    throw responseSchemaError('GET', URL, response)
  }

  return {
    str: response.str,
    int: response.int,
    agi: response.agi,
    luk: response.luk
  }
}

async function authenticate (name, password) {
  try {
    await got.post(`${hahowConfig.API_URL}/auth`, {
      json: { name, password }
    })
    return true
  } catch (e) {
    if (!isExpectedError(e)) {
      logger.warn(`Unable to get expected authenticate response from Hahow, error: ${e.toString()}`)
    }
    return false
  }

  function isExpectedError (error) {
    if (!error.response) {
      return false
    }
    const { statusCode } = error.response
    return statusCode === 400 || statusCode === 401
  }
}

function responseStatusError (method, url, error) {
  return AppError.badImplementation(
    null, `Unable to get response from Hahow, URL: [${method}] ${url}, error: ${error.toString()}`
  )
}

function responseSchemaError (method, url, response) {
  return AppError.badImplementation(
    null, `Unable to handle response from Hahow, URL: [${method}] ${url}, response: ${JSON.stringify(response)}`
  )
}

module.exports = {
  getAllHeroes,
  getHeroById,
  getHeroProfileById,
  authenticate
}
