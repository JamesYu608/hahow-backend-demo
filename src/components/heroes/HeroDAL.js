// Hero's DAL (Data Access Layer), this is where the hero's data come from (e.g. database or API) and CRUD.
// Separate from web and logic layer so that we can change data source without affecting the existing logic

const Hero = require('./Hero')
const hahowAPI = require('../../services/hahowAPI')

class HeroDAL {
  async getAllHeroes (hasProfile = false) {
    const rawHeroesData = await hahowAPI.getAllHeroes()
    if (rawHeroesData.length === 0) {
      return []
    }

    const heroes = rawHeroesData.map(data => {
      return new Hero({
        heroId: data.id,
        name: data.name,
        image: data.image
      })
    })
    if (hasProfile) {
      await this.setHeroesProfile(heroes)
    }

    return heroes
  }

  async getHero (heroId, hasProfile = false) {
    const rawHeroData = await hahowAPI.getHeroById(heroId)
    if (!rawHeroData) {
      return null
    }

    const hero = new Hero({
      heroId: rawHeroData.id,
      name: rawHeroData.name,
      image: rawHeroData.image
    })
    if (hasProfile) {
      await this.setHeroProfile(hero)
    }

    return hero
  }

  async setHeroesProfile (heroes) {
    return Promise.all(heroes.map(hero => this.setHeroProfile(hero)))
  }

  async setHeroProfile (hero) {
    const rawHeroProfileData = await hahowAPI.getHeroProfileById(hero.heroId)
    if (rawHeroProfileData) {
      hero.setProfile({
        str: rawHeroProfileData.str,
        int: rawHeroProfileData.int,
        agi: rawHeroProfileData.agi,
        luk: rawHeroProfileData.luk
      })
    }
  }
}

module.exports = HeroDAL
