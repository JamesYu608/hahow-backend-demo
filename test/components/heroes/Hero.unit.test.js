const Hero = require('../../../src/components/heroes/Hero')

describe('[Unit][Component] Hero model', () => {
  describe('[Function] constructor', () => {
    test('Properties can be setup by passing data', () => {
      // Arrange
      const name = 'GodOfTesting'
      const str = 100

      // Act
      const hero = new Hero({
        name, profile: { str }
      })

      // Assert
      expect(hero.name).toBe(name)
      expect(hero.profile.str).toBe(str)
    })

    test('Properties will be assigned with default values if data is empty', () => {
      // Arrange & Act
      const hero = new Hero()

      // Assert
      expect(hero.heroId).toBe(-1)
      expect(hero.profile.str).toBe(-1)
    })
  })
})
