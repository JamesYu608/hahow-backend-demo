// This is Hahow's APIs response schema
// Even the status code is 200, we still want to make sure the response is what we expected at any time
// e.g. statusCode: 200, body: { code: 1000, message: 'Backend error' }

const Ajv = require('ajv')

const schema = {
  getAllHeroes: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        image: { type: 'string' }
      },
      required: ['id', 'name', 'image']
    }
  },
  getHeroById: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      image: { type: 'string' }
    },
    required: ['id', 'name', 'image']
  },
  getHeroProfileById: {
    type: 'object',
    properties: {
      str: { type: 'integer' },
      int: { type: 'integer' },
      agi: { type: 'integer' },
      luk: { type: 'integer' }
    },
    required: ['str', 'int', 'agi', 'luk']
  }
}

const ajv = new Ajv({ coerceTypes: true })
const getAllHeroesValidate = ajv.compile(schema.getAllHeroes)
const getHeroByIdValidate = ajv.compile(schema.getHeroById)
const getHeroProfileByIdValidate = ajv.compile(schema.getHeroProfileById)

module.exports = {
  getAllHeroesValidate,
  getHeroByIdValidate,
  getHeroProfileByIdValidate
}
