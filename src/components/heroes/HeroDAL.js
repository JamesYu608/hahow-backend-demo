// Hero's DAL (Data Access Layer), this is where the hero's data come from (e.g. database or API) and CRUD.
// Separate from web and logic layer so that we can change data source without affecting the existing logic

const Hero = require('Hero')

class HeroDAL {
  async getAllHeroes (isSetProfile = false) {
    const heroes = [new Hero()]
    if (isSetProfile) {
      await this.setHeroesProfile(heroes)
    }
    return heroes
  }

  async setHeroesProfile (heroes) {
    for (const hero of heroes) {
      hero.setProfile()
    }
  }

  async getHero (heroId, isSetProfile = false) {
    const hero = new Hero()
    if (isSetProfile) {
      await this.setHeroProfile(hero)
    }
  }

  async setHeroProfile (hero) {
    hero.setProfile()
  }
}

module.exports = HeroDAL
