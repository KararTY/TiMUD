import { Actions } from '../Game/Action'

export class Input {
  command: Actions
  fullCommand: string = ''
  args: Array<string>

  constructor (input: string) {
    this.command = Input.parseAction(input.split(' ')[0])
    this.fullCommand = input
    this.args = Input.parseArguments(input.split(' ').slice(1))
  }

  static parseAction (command: string): Actions {
    switch (command) {
      case 'move':
      case 'go':
      case 'enter':
        return 'MOVE'
      case 'use':
        return 'USE'
      case 'attack':
      case 'hurt':
        return 'ATTACK'
      case 'forage':
      case 'harvest':
      case 'mine':
        return 'FORAGE'
      case 'take':
      case 'pick':
        return 'TAKE'
      case 'drop':
        return 'DROP'
      case 'equip':
      case 'wear':
        return 'EQUIP'
      case 'unequip':
        return 'UNEQUIP'
      default:
        return 'NONE'
    }
  }

  static parseArguments (args: Array<string>) {
    for (let index = 0; index < args.length; index++) {
      let arg = args[index]
      switch (arg) {
        case 'left':
        case 'west':
          arg = 'LEFT'
          break
        case 'right':
        case 'east':
          arg = 'RIGHT'
          break
        case 'up':
        case 'north':
          arg = 'UP'
          break
        case 'down':
        case 'south':
          arg = 'DOWN'
          break
      }
      args[index] = arg
    }
    return args
  }
}
