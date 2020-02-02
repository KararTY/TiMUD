import { strict as assert } from 'assert'
import { Game } from '../Game/Game'
import { Action } from '../Game/Action'
import { Input } from '../Game/InputInterpreter'
import { User } from '../Game/Objects/User'

(async function () {
  const errors = []

  const input = new Input('move left two three four')
  const game = new Game()

  try {
    assert.strictEqual(input.args.length, 4, 'Expecting <Input>.args to have 4 values.')
  } catch (error) {
    errors.push({ error, at: 'input' })
  }

  try {
    assert.strictEqual(input.fullCommand, 'move left two three four', 'Expecting <Input>.fullCommand to be equal to the input argument.')
  } catch (error) {
    errors.push({ error, at: 'input2' })
  }

  try {
    assert.strictEqual(input.command, 'MOVE', 'Expecting <Input>.command to be equal to "MOVE".')
  } catch (error) {
    errors.push({ error, at: 'input3' })
  }

  try {
    assert.strictEqual(input.args[0], 'LEFT', 'Expecting <Input>.args[0] to be equal to "LEFT".')
  } catch (error) {
    errors.push({ error, at: 'input4' })
  }

  const user = new User()
  user.id = '1'
  const action = new Action(input, { by: 'USER', user }, game)

  try {
    assert(action.type instanceof Input, 'Expecting <Action>.type to be an instance of <Input>.')
  } catch (error) {
    errors.push({ error, at: 'action' })
  }

  try {
    assert.strictEqual(action.query.by, 'USER', 'Expecting <Action>.query.by to be "USER".')
  } catch (error) {
    errors.push({ error, at: 'action1' })
  }

  try {
    assert.strictEqual(action.query.user.id, '1', 'Expecting <Action>.query.userId to be "1".')
  } catch (error) {
    errors.push({ error, at: 'action2' })
  }

  try {
    assert.doesNotReject(action.run(true), 'Expecting <Action>.run() to not reject.')
  } catch (error) {
    errors.push({ error, at: 'action3' })
  }

  // try {
  //   const game = new Input('zero one two three four')
  //   assert.strictEqual(input.command, 'zero', 'Expecting <Input>.command to be equal to the first word from the input argument.')
  // } catch (error) {
  //   errors.push({ error, at: 'input3' })
  // }

  // assert(game.queryAction(new Tick(new Input('move up'), { by: By.NPC })))

  if (errors.length > 0) {
    for (let index = 0; index < errors.length; index++) {
      const { error, at } = errors[index]
      console.log(
      `At %s test:\nExpecting [%s] but instead got [%s] at check %s.${error.message ? `\n(${error.message})` : ''}\n`,
      at, error.expected, error.actual, error.operator
      )
    }
    throw new Error(`${errors.length} test${errors.length > 1 ? 's' : ''} failed.`)
  } else game.cache.client.quit()
})()
