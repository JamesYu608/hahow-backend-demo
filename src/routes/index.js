// This is the entry point of all routes

const { Router } = require('express')
const bodyParser = require('body-parser')

const router = Router()
router.use(bodyParser.json())

router.get('/health', (req, res) => { res.status(200).send() })
router.get('/', (req, res) => res.send('Hello World!'))

module.exports = router
