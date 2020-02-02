import BigNumber from 'bignumber.js'

BigNumber.config({ DECIMAL_PLACES: 2 })

export class Position {
  x: BigNumber
  y: BigNumber

  constructor ({ x = '0', y = '0' } : { x?: string | number | BigNumber, y?: string | number | BigNumber } = {}) {
    this.x = x instanceof BigNumber ? x : new BigNumber(x)
    this.y = y instanceof BigNumber ? y : new BigNumber(y)
  }
}

export class User {
  id: string
  position: Position

  constructor ({ position = new Position(), id = '0' } : { position?: Position, id?: string } = {}) {
    this.id = id
    this.position = position
  }

  toString () {
    return JSON.stringify(this)
  }
}
