// This is the entry point of all routes

const { Router } = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const logger = require('../utils/logger')
const heroes = require('./heros')

const router = Router()
router.use(morgan('tiny', { stream: logger.infoStream }))
router.use(bodyParser.json())

router.get('/health', (req, res) => { res.status(200).send() })
router.get('/', (req, res) => res.send('Hello World!'))

router.use('/heroes', heroes)

module.exports = router
