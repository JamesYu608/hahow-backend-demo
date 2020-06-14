const authenticate = require('../../src/middlewares/authenticate')
const hahowAPI = require('../../src/services/hahowAPI')

describe('[Integration][Middleware] Authenticate', () => {
  test('Has name and password, authentication passed, req.isAuthenticated should be true', async () => {
    // Arrange
    const hahowAuthenticateSpy = jest.spyOn(hahowAPI, 'authenticate').mockResolvedValue(true)
    const req = {
      headers: {
        name: 'james',
        password: 'correct password'
      }
    }

    // Act
    await authenticate(req, {}, jest.fn())

    // Assert
    expect(req.isAuthenticated).toBe(true)

    hahowAuthenticateSpy.mockRestore()
  })

  test('Has name and password, but authentication failed, req.isAuthenticated should be false', async () => {
    // Arrange
    const hahowAuthenticateSpy = jest.spyOn(hahowAPI, 'authenticate').mockResolvedValue(false)
    const req = {
      headers: {
        name: 'james',
        password: 'wrong password'
      }
    }

    // Act
    await authenticate(req, {}, jest.fn())

    // Assert
    expect(req.isAuthenticated).toBe(false)

    hahowAuthenticateSpy.mockRestore()
  })

  test('No name or password, auth API should not be called and req.isAuthenticated should be false', async () => {
    // Arrange
    const hahowAuthenticateSpy = jest.spyOn(hahowAPI, 'authenticate')
    const req = {
      headers: { /* empty */ }
    }

    // Act
    await authenticate(req, {}, jest.fn())

    // Assert
    expect(hahowAuthenticateSpy).not.toHaveBeenCalled()
    expect(req.isAuthenticated).toBe(false)

    hahowAuthenticateSpy.mockRestore()
  })
})
