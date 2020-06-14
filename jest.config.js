// General test config (for unit and integration)

module.exports = {
  bail: true,
  verbose: true,
  setupFilesAfterEnv: ['./jest.integration.setup'],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/'
  ]
}
