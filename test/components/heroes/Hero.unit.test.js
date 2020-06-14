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

  describe('[Function] attack', () => {
    test('Damage is always positive even if hero\'s profile is not initialized', () => {
      // Arrange
      const hero = new Hero()

      // Act
      const damage = hero.attack()

      // Assert
      expect(damage > 0).toBe(true)
    })
  })

  describe('[Function] duel', () => {
    test('If we fix the random number, the more powerful hero will always win!', () => {
      const testingDuelCount = 10
      // Arrange
      const hero1 = new Hero({ heroId: 1, name: 'Tester1', profile: { str: 100, int: 100, agi: 100, luk: 100 } })
      const hero2 = new Hero({ heroId: 2, name: 'Tester2', profile: { str: 50, int: 50, agi: 50, luk: 50 } })
      const randomSpy = jest.spyOn(global.Math, 'random').mockReturnValue(0.8)

      // Act
      const results = []
      for (let i = 0; i < testingDuelCount; i++) {
        results.push(Hero.duel(hero1, hero2))
      }

      // Assert
      for (const result of results) {
        expect(result.winner).toBe(hero1.name)
      }

      randomSpy.mockRestore()
    })
  })
})
