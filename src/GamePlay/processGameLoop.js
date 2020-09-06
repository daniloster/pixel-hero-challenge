import { Dictionary } from '../MapEditor/Tilemap'
import ComputeDirection from './ComputeDirection'
import GameState from './GameState'
import Keys from './Keys'
import validateGameFinished from './validateGameFinished'

export default function processGameLoop(gameState, mapState, actions) {
  actions.forEach(([action, isActive]) => {
    if (!isActive) {
      return
    }

    const stackState = gameState.get()
    const currentState = stackState[stackState.length - 1]
    if (currentState === GameState.Running) {
      processGameAction(mapState, action)
      setTimeout(() => validateGameFinished(gameState, mapState))
    }
  })
}

const Moveable = {
  [Keys.ArrowLeft]: true,
  [Keys.ArrowRight]: true,
  [Keys.ArrowUp]: true,
  [Keys.ArrowDown]: true,
}

function processGameAction(mapState, action) {
  const { tilemap } = mapState.get()
  if (Moveable[action]) {
    let indexColumn = -1
    const indexRow = tilemap.findIndex((currentColumns) => {
      const indexCurrentColumns = currentColumns.findIndex((currentCells) =>
        currentCells.includes(Dictionary.Player),
      )
      if (indexCurrentColumns > -1) {
        indexColumn = indexCurrentColumns
        return true
      }
      return false
    })
    const player = {
      x: indexColumn,
      y: indexRow,
    }
    const compute = ComputeDirection[action]
    compute(mapState, player)
  }
}
