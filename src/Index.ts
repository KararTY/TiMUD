import { Game } from './Game/Game'
import { config } from 'dotenv'
import { User } from './Game/Objects/User'

config()

;(async function () {
  // const game = new Game(100)
  const game = new Game()

  await game.cache.initialize(true)

  game.events.on('actions', async () => {
    const res = await game.cache.readAllUsers()
    console.table(res)
    if (Date.now() > (game.startedAt.getTime() + (10 * 1000))) {
      clearTimeout(game.timerId)
      game.cache.client.quit()
    }
  })

  const int = setInterval(async () => {
    const movements = ['move up', 'move down', 'move left', 'move right']
    for (let index = 0; index < 10; index++) {
      let user = await game.cache.readUser(index.toString())
      if (!(user instanceof User)) {
        user = new User()
        user.id = index.toString()
        await game.cache.createUser(user)
      }
      game.queryAction(movements[Math.floor(Math.random() * movements.length)], { by: 'USER', user })
    }
    if (Date.now() > (game.startedAt.getTime() + (10 * 1000))) clearInterval(int)
  })

  game.startTimer()
})()
