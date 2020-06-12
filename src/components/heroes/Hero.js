// Hero class, this is what we use in web and logic layer, separate from data layer

class Hero {
  constructor (data = {}) {
    this.heroId = parseInt(data.heroId) || -1
    this.name = data.name || ''
    this.image = data.image || ''
    this.setProfile(data.profile)
  }

  setProfile (profile = {}) {
    this.profile = {
      str: parseInt(profile.str) || -1,
      int: parseInt(profile.int) || -1,
      agi: parseInt(profile.agi) || -1,
      luk: parseInt(profile.luk) || -1
    }
  }
}

module.exports = Hero
