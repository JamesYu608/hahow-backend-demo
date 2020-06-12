// This is the entry point of web layer, I use express as web framework

const express = require('express')
const routes = require('./routes')

const app = express()
app.use(routes)

module.exports = app
