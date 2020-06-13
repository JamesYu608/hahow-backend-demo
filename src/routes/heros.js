// This is the entry point of heroes routes
// Generally, I will put each route's business logic in a single file (e.g. routes/heroes/getAllHeroes.js)
// But here are only two GET methods, so I put them together in the same file

const { Router } = require('express')
const HeroDAL = require('../components/heroes/HeroDAL')
const AppError = require('../utils/AppError')

const router = Router()
router.get('/', getAllHeroes)
router.get('/:heroId', getHero)

const heroDAL = new HeroDAL()

async function getAllHeroes (req, res) {
  const hasProfile = req.isAuthenticated
  const heroes = await heroDAL.getAllHeroes(hasProfile)
  const data = heroes.map(hero => {
    return buildResponseData(hero, hasProfile)
  })

  res.json({
    heroes: data
  })
}

async function getHero (req, res) {
  const hasProfile = req.isAuthenticated
  const { heroId } = req.params
  const hero = await heroDAL.getHero(heroId, hasProfile)
  if (!hero) {
    throw AppError.notFound('Hero is not found!')
  }
  const data = buildResponseData(hero, hasProfile)
  res.json(data)
}

function buildResponseData (hero, hasProfile) {
  const heroData = {
    id: hero.heroId.toString(),
    name: hero.name,
    image: hero.image
  }
  if (hasProfile) {
    const heroProfile = hero.profile
    heroData.profile = {
      str: heroProfile.str,
      int: heroProfile.int,
      agi: heroProfile.agi,
      luk: heroProfile.luk
    }
  }

  return heroData
}

module.exports = router
