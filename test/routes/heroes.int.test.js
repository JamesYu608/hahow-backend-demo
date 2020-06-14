const request = require('supertest')
const app = require('../../src')
const Hero = require('../../src/components/heroes/Hero')
const HeroDAL = require('../../src/components/heroes/HeroDAL')
const hahowAPI = require('../../src/services/hahowAPI')
const AppError = require('../../src/utils/AppError')

describe('[Integration][Route] /heroes', () => {
  const hero1 = new Hero({ heroId: 1, name: 'Tester1', profile: { str: 10, int: 9, agi: 8, luk: 7 } })
  const hero2 = new Hero({ heroId: 2, name: 'Tester2', profile: { str: 7, int: 8, agi: 9, luk: 10 } })

  describe('[Get] /', () => {
    test('Not authenticated, result should be an array of heroes\' limit profile', async () => {
      // Arrange
      const heroDALGetAllHeroesSpy = jest.spyOn(HeroDAL.prototype, 'getAllHeroes')
        .mockResolvedValue([hero1, hero2])

      // Act
      const { body: result } = await request(app)
        .get('/heroes/')
        .expect(200)

      // Assert
      expect(heroDALGetAllHeroesSpy.mock.calls[0][0]).toBe(false)
      expect(result).toHaveProperty('heroes')
      expect(Array.isArray(result.heroes)).toBe(true)
      expect(result.heroes[0].name).toBe(hero1.name)
      expect(result.heroes[0]).not.toHaveProperty('profile')

      heroDALGetAllHeroesSpy.mockRestore()
    })

    test('Authenticated, result should be an array of heroes\' full profile', async () => {
      // Arrange
      const hahowAuthenticateSpy = jest.spyOn(hahowAPI, 'authenticate').mockResolvedValue(true)
      const heroDALGetAllHeroesSpy = jest.spyOn(HeroDAL.prototype, 'getAllHeroes')
        .mockResolvedValue([hero1, hero2])

      // Act
      const { body: result } = await request(app)
        .get('/heroes/')
        .set({ name: 'hahow', password: 'rocks' })
        .expect(200)

      // Assert
      expect(heroDALGetAllHeroesSpy.mock.calls[0][0]).toBe(true)
      expect(result).toHaveProperty('heroes')
      expect(Array.isArray(result.heroes)).toBe(true)
      expect(result.heroes[0].name).toBe(hero1.name)
      expect(result.heroes[0]).toHaveProperty('profile')
      expect(result.heroes[0].profile.str).toBe(hero1.profile.str)

      hahowAuthenticateSpy.mockRestore()
      heroDALGetAllHeroesSpy.mockRestore()
    })

    test('Encounter error when getting hero data, response should be 500 error', async () => {
      // Arrange
      const heroDALGetAllHeroesSpy = jest.spyOn(HeroDAL.prototype, 'getAllHeroes')
        .mockImplementation(() => {
          throw AppError.badImplementation()
        })

      // Act & Assert
      await request(app)
        .get('/heroes/')
        .expect(500)

      heroDALGetAllHeroesSpy.mockRestore()
    })
  })

  describe('[Get] /:heroId', () => {
    test('Not authenticated, result should be the hero\'s limit profile', async () => {
      // Arrange
      const heroDALGetHeroSpy = jest.spyOn(HeroDAL.prototype, 'getHero')
        .mockResolvedValue(hero1)

      // Act
      const { body: result } = await request(app)
        .get(`/heroes/${hero1.heroId}`)
        .expect(200)

      // Assert
      const [arg1, arg2] = heroDALGetHeroSpy.mock.calls[0]
      expect(arg1).toBe(hero1.heroId)
      expect(arg2).toBe(false)
      expect(result).toHaveProperty('name')
      expect(result.name).toBe(hero1.name)
      expect(result).not.toHaveProperty('profile')

      heroDALGetHeroSpy.mockRestore()
    })

    test('Authenticated, result should be the hero\'s full profile', async () => {
      // Arrange
      const hahowAuthenticateSpy = jest.spyOn(hahowAPI, 'authenticate').mockResolvedValue(true)
      const heroDALGetHeroSpy = jest.spyOn(HeroDAL.prototype, 'getHero')
        .mockResolvedValue(hero1)

      // Act
      const { body: result } = await request(app)
        .get(`/heroes/${hero1.heroId}`)
        .set({ name: 'hahow', password: 'rocks' })
        .expect(200)

      // Assert
      const [arg1, arg2] = heroDALGetHeroSpy.mock.calls[0]
      expect(arg1).toBe(hero1.heroId)
      expect(arg2).toBe(true)
      expect(result).toHaveProperty('profile')
      expect(result.profile.str).toBe(hero1.profile.str)

      hahowAuthenticateSpy.mockRestore()
      heroDALGetHeroSpy.mockRestore()
    })

    test('Hero is not found, response should be 404 error', async () => {
      // Arrange
      const heroDALGetHeroSpy = jest.spyOn(HeroDAL.prototype, 'getHero').mockResolvedValue(null)

      // Act & Assert
      await request(app)
        .get('/heroes/100')
        .expect(404)

      heroDALGetHeroSpy.mockRestore()
    })
  })
})
