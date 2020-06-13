// This is the entry point of all routes

const { Router } = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const logger = require('../utils/logger')
const authenticate = require('../middlewares/authenticate')
const heroes = require('./heros')

const router = Router()
// middlewares
router.use(morgan('tiny', { stream: logger.infoStream }))
router.use(bodyParser.json())
router.use(authenticate)

// basic routes
router.get('/health', (req, res) => { res.status(200).send() })
router.get('/', (req, res) => res.send('Hello World!'))

// API routes
router.use('/heroes', heroes)

module.exports = router
