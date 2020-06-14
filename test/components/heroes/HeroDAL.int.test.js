const HeroDAL = require('../../../src/components/heroes/HeroDAL')
const hahowAPI = require('../../../src/services/hahowAPI')
const heroesSeed = require('../../seed/heroes.seed')
const AppError = require('../../../src/utils/AppError')

describe('[Integration][Component] HeroDAL', () => {
  const heroDAL = new HeroDAL()

  describe('[Function] getAllHeroes', () => {
    test('Get expected data, no profile', async () => {
      // Arrange
      const mockHeroesData = heroesSeed.map(data => {
        return {
          id: data.id,
          name: data.name,
          image: data.image
        }
      })
      const hahowGetAllHeroesSpy = jest.spyOn(hahowAPI, 'getAllHeroes').mockResolvedValue(mockHeroesData)

      // Act
      const heroes = await heroDAL.getAllHeroes()

      // Assert
      expect(heroes.length).toBe(mockHeroesData.length)
      expect(heroes[0].name).toBe(mockHeroesData[0].name)

      hahowGetAllHeroesSpy.mockRestore()
    })

    test('Get expected data, has profile', async () => {
      // Arrange
      const mockHeroesData = heroesSeed.map(data => {
        return {
          id: data.id,
          name: data.name,
          image: data.image,
          profile: {
            str: data.profile.str,
            int: data.profile.int,
            agi: data.profile.agi,
            luk: data.profile.luk
          }
        }
      })
      const hahowGetAllHeroesSpy = jest.spyOn(hahowAPI, 'getAllHeroes').mockResolvedValue(mockHeroesData)
      const hahowGetHeroProfileByIdSpy = jest.spyOn(hahowAPI, 'getHeroProfileById').mockImplementation(heroId => {
        for (const mockHeroData of mockHeroesData) {
          if (parseInt(mockHeroData.id) === heroId) {
            return {
              str: mockHeroData.profile.str,
              int: mockHeroData.profile.int,
              agi: mockHeroData.profile.agi,
              luk: mockHeroData.profile.luk
            }
          }
        }
      })

      // Act
      const heroes = await heroDAL.getAllHeroes(true)

      // Assert
      expect(heroes.length).toBe(mockHeroesData.length)
      expect(heroes[0].profile.str).toBe(mockHeroesData[0].profile.str)

      hahowGetAllHeroesSpy.mockRestore()
      hahowGetHeroProfileByIdSpy.mockRestore()
    })

    test('Get expected data, has profile, but encounter error when fetching profile, should throw error', async () => {
      // Arrange
      const mockHeroesData = heroesSeed.map(data => {
        return {
          id: data.id,
          name: data.name,
          image: data.image
        }
      })
      const hahowGetAllHeroesSpy = jest.spyOn(hahowAPI, 'getAllHeroes').mockResolvedValue(mockHeroesData)
      const hahowGetHeroProfileByIdSpy = jest.spyOn(hahowAPI, 'getHeroProfileById').mockImplementation(() => {
        throw AppError.badImplementation()
      })

      // Act & Assert
      await expect(heroDAL.getAllHeroes(true)).rejects.toThrowError()

      hahowGetAllHeroesSpy.mockRestore()
      hahowGetHeroProfileByIdSpy.mockRestore()
    })
  })
})
