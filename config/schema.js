// This file is used to validate our config is setup properly when service is starting
// To make sure that there are no missing environment variables at runtime

const Ajv = require('ajv')

const dataSourceSchema = {
  type: 'object',
  properties: {
    HAHOW: {
      type: 'object',
      properties: {
        API_URL: { type: 'string' }
      },
      required: ['API_URL']
    }
  },
  required: ['HAHOW']
}

const schema = {
  type: 'object',
  properties: {
    PORT: { type: 'number' },
    DATA_SOURCE: dataSourceSchema
  },
  required: ['PORT', 'DATA_SOURCE']
}

const ajv = new Ajv({ removeAdditional: true, useDefaults: true, coerceTypes: true })
const validate = ajv.compile(schema)

module.exports = {
  validate
}
