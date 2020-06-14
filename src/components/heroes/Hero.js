// Hero class, this is what we use in web and logic layer, separate from data layer

const MIN_POWER = 15
const DUEL_WIN_SCORE = 3
const DUEL_MAX_ROUND = 10

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

  // just for fun
  attack () {
    const { str, int, agi, luk } = this.profile
    const power = Math.max(str + int + agi + luk, MIN_POWER)

    // damage
    return Math.floor(power * getRandomArbitrary(0.7, 1.0))

    function getRandomArbitrary (min, max) {
      return Math.random() * (max - min) + min
    }
  }

  // just for fun
  // if someone wins ${DUEL_WIN_SCORE} times in a row, he wins!
  static duel (hero1, hero2) {
    const history = []

    let round = 1
    let [hero1Score, hero2Score] = [0, 0]
    let winner = null

    while (round <= DUEL_MAX_ROUND) {
      const [damageHero1, damageHero2] = [hero1.attack(), hero2.attack()]
      if (damageHero1 === damageHero2) {
        continue
      }

      if (damageHero1 > damageHero2) {
        history.push(buildRoundFightResult(hero1, hero2, damageHero1))
        hero1Score++
        hero2Score = 0
      } else {
        history.push(buildRoundFightResult(hero2, hero1, damageHero2))
        hero2Score++
        hero1Score = 0
      }

      if (hero1Score === DUEL_WIN_SCORE) {
        history.push(buildWinResult(hero1))
        winner = hero1
        break
      }
      if (hero2Score === DUEL_WIN_SCORE) {
        history.push(buildWinResult(hero2))
        winner = hero2
        break
      }
      round++
    }

    // After ${DUEL_MAX_ROUND}, it's still no winner, draw!
    if (!winner) {
      history.push(buildDrawResult())
    }

    return {
      winner: winner ? winner.name : '',
      history
    }

    function buildRoundFightResult (winner, loser, damage) {
      return `${winner.name} hit ${loser.name}, damage: ${damage}`
    }

    function buildWinResult (winner) {
      return `${winner.name} win the fight!`
    }

    function buildDrawResult () {
      return 'It\'s a draw!'
    }
  }
}

module.exports = Hero
