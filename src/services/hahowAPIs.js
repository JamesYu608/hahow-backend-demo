// All remote APIs are modularized and located under the /services folder
// Here are Hahow's APIs

const got = require('got')
const hahowConfig = require('../../config').DATA_SOURCE.HAHOW
const schema = require('./hahowAPIsSchema')

const HEROES_URL = `${hahowConfig.API_URL}/heroes`

async function getAllHeroes () {
  const response = await getResponse(
    'get', HEROES_URL, schema.getAllHeroesValidate)
  return response.map(data => ({
    id: data.id,
    name: data.name,
    image: data.image
  }))
}

async function getHeroById (heroId) {
  const response = await getResponse(
    'get', `${HEROES_URL}/${heroId}`, schema.getHeroByIdValidate)
  return {
    id: response.id,
    name: response.name,
    image: response.image
  }
}

async function getHeroProfileById (heroId) {
  const response = await getResponse(
    'get', `${HEROES_URL}/${heroId}/profile`, schema.getHeroProfileByIdValidate)
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
    // TODO: 401 and 400
    console.log(e.response.statusCode)
    return false
    // TODO: unable to get data from hahow, throw error
  }
}

async function getResponse (method = 'get', url = '', validate) {
  let response
  try {
    response = await got[method](url).json()
  } catch (e) {
    // TODO: log, unable to get data from hahow, throw error
  }

  if (!validate(response)) {
    // TODO: log, bad response data, throw error
    // e.g. { code: 1000, message: 'Backend error' }
    console.log('error')
  }

  return response
}

module.exports = {
  getAllHeroes,
  getHeroById,
  getHeroProfileById,
  authenticate
}
