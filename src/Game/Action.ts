import { Game, By } from './Game'
import { Input } from './InputInterpreter'
import { Position, User } from './Objects/User'

export type Query = {
  by: By,
  user: User
}

export type Actions = 'NONE' | 'MOVE' | 'USE' | 'ATTACK' | 'FORAGE' | 'TAKE' | 'DROP' | 'EQUIP' | 'UNEQUIP'

export class Action {
  type: Input
  query: Query
  game?: Game

  constructor (type: Input, query: Query, game?: Game) {
    this.type = type
    this.query = query
    this.game = game
  }

  run (test?: boolean): Promise<any> {
    return new Promise((resolve) => {
      if (test) {
        setTimeout(() => resolve(true), 1000)
      } else {
        switch (this.type.command) {
          case 'MOVE':
            this.move().then(resolve)
            break
          case 'ATTACK':
            this.attack().then(resolve)
            break
          default:
            console.log(this)
            resolve(this.type.command)
            break
        }
      }
    })
  }

  async move () {
    if (!this.game) return false
    const position = new Position(this.query.user.position)

    let xOrY = 'x'

    switch (this.type.args[0]) {
      case 'LEFT':
        position.x = position.x.minus('0.1')
        break
      case 'RIGHT':
        position.x = position.x.plus('0.1')
        break
      case 'UP':
        position.y = position.y.minus('0.1')
        xOrY = 'y'
        break
      case 'DOWN':
        position.y = position.y.plus('0.1')
        xOrY = 'y'
        break
    }

    return this.game.cache.updateUser(this.query.user.id, (xOrY === 'x' ? position.x : position.y).toString(), `position.${xOrY}`)
  }

  async attack () {
    if (!this.game) return false
    const target = await this.game.cache.readUser(this.type.args[0])
    if (target) {

    }
  }
}
