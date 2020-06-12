// This is the entry point of heroes routes
// Generally, I will put each route's business logic in a single file (e.g. routes/heroes/getAllHeroes.js)
// But here are only two GET methods, so I put them together in the same file

const { Router } = require('express')

const router = Router()
router.get('/', getAllHeroes)
router.get('/:heroId', getHero)

async function getAllHeroes (req, res) {
  res.json([
    {
      id: '1',
      name: 'Daredevil',
      image: 'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg'
    },
    {
      id: '2',
      name: 'Thor',
      image: 'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg'
    }
  ])
}

async function getHero (req, res) {
  res.json({
    id: '1',
    name: 'Daredevil',
    image: 'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg'
  })
}

module.exports = router
