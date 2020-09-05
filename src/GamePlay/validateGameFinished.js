import { Dictionary } from '../MapEditor/Tilemap'
import GameState from './GameState'

export default function validateGameFinished(gameState, mapState) {
  let possiblyFinished = true
  mapState.get().tilemap.forEach((columns) => {
    columns.forEach((cells) => {
      if (cells.includes(Dictionary.RescuableBox)) {
        possiblyFinished =
          possiblyFinished && cells.includes(Dictionary.RescuePoint)
      }
    })
  })
  if (possiblyFinished) {
    gameState.set(() => [GameState.Succeed])
  }
}
