// import { Database } from '../Database/Database'
import { Action, Query } from './Action'
import { User } from './Objects/User'
import { GameCache } from '../Database/Cache'
import EventEmitter from 'events'
import { Input } from './InputInterpreter'
import { DatabaseConnection } from '../Database/Database'

export type By = 'USER' | 'NPC' | 'WORLD'

export class Game {
  ticks: Array<Action> = []
  ticknumber: number
  startedAt: Date = new Date()
  nextDbUpload: Date = new Date(new Date().getTime() + (60 * 1000))
  cache: GameCache = new GameCache()
  database: DatabaseConnection = new DatabaseConnection()
  events: EventEmitter = new EventEmitter()
  timerId: any

  startTimer = () => {
    this.timerId = setTimeout(async () => {
      const res = await this.update()
      this.ticks = []

      if (res && res.length > 0) {
        this.events.emit('actions', res)
      }

      if (new Date().getTime() > this.nextDbUpload.getTime()) {
        // DB upload.
        console.log('Uploading to DB')
        this.events.emit('db')
        this.nextDbUpload = new Date(new Date().getTime() + (60 * 1000))
      }
      this.startTimer()
    }, this.ticknumber)
  }

  constructor (ticknumber?: number) {
    this.ticknumber = ticknumber || 100
  }

  queryAction (input: string, query: Query): boolean {
    const cacheEntry = new Action(new Input(input), query)

    const initialLength = this.ticks.length
    this.ticks = this.ticks.filter(action => action.query.user.id ? action.query.user.id !== cacheEntry.query.user.id : true)
    cacheEntry.game = this
    this.ticks.push(cacheEntry)
    return initialLength + 1 === this.ticks.length
  }

  // Game loop
  async update () {
    // TODO get rid of inactive users

    if (this.ticks.length > 0) {
      const promises: Array<Promise<any>> = []

      for (let index = 0; index < this.ticks.length; index++) {
        const action = this.ticks[index]
        promises.push(action.run())
      }

      return Promise.all(promises)
    } else Promise.resolve()
  }
}
