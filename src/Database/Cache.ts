// CACHING WITH REDIS
import Redis from 'ioredis'
import { User } from '../Game/Objects/User'

export class GameCache {
  client: Redis.Redis = new Redis()

  constructor (client?: Redis.Redis) {
    if (client) this.client = client
    this.client.on('error', (e) => this.onError(e))
  }

  async initialize (reset?: boolean) {
    try {
      await this.client.call('JSON.GET', 'users')
      if (reset) await this.client.call('JSON.SET', 'users', '.', JSON.stringify({}))
    } catch (e) {
      if (e.message === 'ERR path does not exist') await this.client.call('JSON.SET', 'users', '.', JSON.stringify({}))
      else console.error(e)
    }
  }

  onError (e: any) {
    console.table(e)
    if (e.code === 'ECONNREFUSED') throw new Error('Cache server offline.')
  }

  static parseResponse (response: string) {
    switch (response) {
      case 'OK':
        return true
      default:
        return response
    }
  }

  async createUser (user: User) {
    const response = await this.client.call('JSON.SET', 'users', `.${user.id}`, user.toString())
    return GameCache.parseResponse(response.toString()) ? user : GameCache.parseResponse(response.toString())
  }

  async readUser (id: string) {
    try {
      const response = await this.client.call('JSON.GET', 'users', `.${id}`)
      return GameCache.parseResponse(response.toString()) ? new User(JSON.parse(response.toString())) : GameCache.parseResponse(response.toString())
    } catch (e) {
      if (e.message === 'ERR path does not exist') return false
      else console.error(e)
    }
  }

  async updateUser (id: string, data: User | any, path?: string) {
    const response = await this.client.call('JSON.SET', 'users', `.${id}${path ? `.${path}` : ''}`, data)
    return GameCache.parseResponse(response.toString())
  }

  async deleteUser (user: User) {
    const response = await this.client.call('JSON.DEL', 'users', `.${user.id}`)
    return GameCache.parseResponse(response.toString())
  }

  async readAllUsers () {
    const response = await this.client.call('JSON.GET', 'users')
    return GameCache.parseResponse(response.toString())
      ? Object.values(JSON.parse(response.toString())).map((obj: any) => new User(obj))
      : GameCache.parseResponse(response.toString())
  }
}
