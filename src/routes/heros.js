// This is the entry point of heroes routes

// Generally, I will put each route's business logic and request schema in a single file (e.g. routes/heroes/getAllHeroes.js)
// But here are only few methods, so I put them together in this file

const { Router } = require('express')
const requestValidator = require('../middlewares/requestValidator')
const Hero = require('../components/heroes/Hero')
const HeroDAL = require('../components/heroes/HeroDAL')
const AppError = require('../utils/AppError')

// Request schema
// Early return 400 when request format is unexpected
const createDuelSchema = {
  body: {
    type: 'object',
    properties: {
      heroId1: { type: 'integer' },
      heroId2: { type: 'integer' }
    },
    required: ['heroId1', 'heroId2']
  }
}

// Setup routes
const router = Router()
router.get('/', getAllHeroes)
router.get('/:heroId', getHero)
router.post('/duel', requestValidator(createDuelSchema), createDuel)

// Business logic
const heroDAL = new HeroDAL()

async function getAllHeroes (req, res) {
  const hasProfile = req.isAuthenticated
  const heroes = await heroDAL.getAllHeroes(hasProfile)
  const data = heroes.map(hero => {
    return buildHeroData(hero, hasProfile)
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
  const data = buildHeroData(hero, hasProfile)
  res.json(data)
}

async function createDuel (req, res) {
  const { heroId1, heroId2 } = req.body
  const [hero1, hero2] = await Promise.all([
    heroDAL.getHero(heroId1, true),
    heroDAL.getHero(heroId2, true)
  ])
  if (!hero1 || !hero2) {
    throw AppError.notFound('Hero is not found!')
  }
  const results = Hero.duel(hero1, hero2)
  res.json(results)
}

function buildHeroData (hero, hasProfile) {
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
