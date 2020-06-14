const got = require('got')
const hahowAPI = require('../../src/services/hahowAPI')
const heroesSeed = require('../seed/heroes.seed')

describe('[Integration][Service] Hahow API', () => {
  describe('[Function] getAllHeroes', () => {
    test('Response is 200 and data is expected, return heroes data', async () => {
      // Arrange
      const mockHeroesData = heroesSeed.map(data => {
        return {
          id: data.id,
          name: data.name,
          image: data.image
        }
      })
      const gotSpy = jest.spyOn(got, 'get').mockImplementation(() => {
        return {
          json: () => mockHeroesData
        }
      })

      // Act
      const result = await hahowAPI.getAllHeroes()

      // Assert
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(mockHeroesData.length)
      expect(result[0].name).toBe(mockHeroesData[0].name)

      gotSpy.mockRestore()
    })

    test('Response is 200 but data is not expected, throw error', async () => {
      // Arrange
      const response = { code: 1000, message: 'Backend error' }
      const gotSpy = jest.spyOn(got, 'get').mockImplementation(() => {
        return {
          json: () => response
        }
      })

      // Act & Assert
      await expect(hahowAPI.getAllHeroes()).rejects.toThrowError()

      gotSpy.mockRestore()
    })

    test('Response is not 200, throw error', async () => {
      // Arrange
      const gotSpy = jest.spyOn(got, 'get').mockImplementation(() => {
        throw new Error('whatever')
      })

      // Act & Assert
      await expect(hahowAPI.getAllHeroes()).rejects.toThrowError()

      gotSpy.mockRestore()
    })
  })

  describe('[Function] getHeroById', () => {
    test('Response is 200 and get expected data, return hero data', async () => {
      // Arrange
      const mockHeroData = {
        id: heroesSeed[0].id,
        name: heroesSeed[0].name,
        image: heroesSeed[0].image
      }
      const gotSpy = jest.spyOn(got, 'get').mockImplementation(() => {
        return {
          json: () => mockHeroData
        }
      })

      // Act
      const result = await hahowAPI.getHeroById(mockHeroData.id)

      // Assert
      expect(result.name).toBe(mockHeroData.name)

      gotSpy.mockRestore()
    })

    test('Response is 404, return null', async () => {
      // Arrange
      const gotSpy = jest.spyOn(got, 'get').mockImplementation(() => {
        const error = new Error('404 error')
        error.response = {
          statusCode: 404
        }
        throw error
      })

      // Act
      const result = await hahowAPI.getHeroById(-1)

      // Assert
      expect(result).toBeNull()

      gotSpy.mockRestore()
    })
  })

  describe('[Function] getHeroProfileById', () => {
    test('Response is 200 and data is expected, return hero data', async () => {
      // Arrange
      const seedHeroProfile = heroesSeed[0].profile
      const mockHeroProfile = {
        str: seedHeroProfile.str,
        int: seedHeroProfile.int,
        agi: seedHeroProfile.agi,
        luk: seedHeroProfile.luk
      }
      const gotSpy = jest.spyOn(got, 'get').mockImplementation(() => {
        return {
          json: () => mockHeroProfile
        }
      })

      // Act
      const result = await hahowAPI.getHeroProfileById(heroesSeed[0].id)

      // Assert
      expect(result.str).toBe(mockHeroProfile.str)

      gotSpy.mockRestore()
    })

    test('Response is 404, return null', async () => {
      // Arrange
      const gotSpy = jest.spyOn(got, 'get').mockImplementation(() => {
        const error = new Error('404 error')
        error.response = {
          statusCode: 404
        }
        throw error
      })

      // Act
      const result = await hahowAPI.getHeroProfileById(-1)

      // Assert
      expect(result).toBeNull()

      gotSpy.mockRestore()
    })
  })

  describe('[Function] authenticate', () => {
    test('Response is 200, return true', async () => {
      // Arrange
      const gotSpy = jest.spyOn(got, 'post').mockResolvedValue(true)

      // Act
      const result = await hahowAPI.authenticate('hahow', 'rocks')

      // Assert
      expect(result).toBe(true)

      gotSpy.mockRestore()
    })

    test('Response is not 200, return false', async () => {
      // Arrange
      const gotSpy = jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error('whatever')
      })

      // Act
      const result = await hahowAPI.authenticate('hahow', 'rocks')

      // Assert
      expect(result).toBe(false)

      gotSpy.mockRestore()
    })
  })
})
