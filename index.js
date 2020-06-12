// This is the entry point of the server
// I separate express app and server so it's easier for testing routes instead of starting the real server
// (e.g. supertest, https://www.npmjs.com/package/supertest)

const { PORT } = require('./config')
const app = require('./src')

app.listen(PORT, () => console.log(`Hahow backend demo project is listening on port ${PORT}!`))
