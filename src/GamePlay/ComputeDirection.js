import { Dictionary } from '../MapEditor/Tilemap'
import Keys from './Keys'

const OUT_OF_MAP = [Dictionary.None]
const EMPTY_LIST = []

function isGround(assets) {
  return (
    assets.length === 0 ||
    (assets.length === 1 && assets[0] === Dictionary.RescuePoint)
  )
}

function computeCells(cells, rowIndex, columnIndex, targets) {
  let newCells = cells
  targets.forEach((target) => {
    const {
      coord: { x, y },
      add = [],
      remove = null,
    } = target
    if (rowIndex === y && columnIndex === x) {
      newCells = newCells.filter((item) => item !== remove).concat(add)
    }
  })
  return newCells
}

function computeMovements(state, movements) {
  return {
    ...state,
    tilemap: state.tilemap.map((columns, rowIndex) =>
      columns.map((cells, columnIndex) =>
        computeCells(cells, rowIndex, columnIndex, movements),
      ),
    ),
  }
}

export function computeMovementX(mapState, player, direction) {
  mapState.set((oldState) => {
    const { tilemap, columns } = mapState.get()
    const nextXX = player.x + 2 * direction
    const nextX = player.x + direction
    const nextY = player.y
    // within range
    if (nextX < columns && nextX > -1) {
      const assets = tilemap[nextY][nextX]
      const isMoveable = isGround(assets)
      const movements = [
        { coord: player, remove: Dictionary.Player },
        {
          coord: { y: nextY, x: nextX },
          add: Dictionary.Player,
        },
      ]
      // ground assets
      if (!isMoveable) {
        const nextMoveable = (tilemap[nextY][nextX] || OUT_OF_MAP).find(
          (item) =>
            item === Dictionary.MoveableBox || item === Dictionary.RescuableBox,
        )
        // next moveable assets
        if (nextMoveable) {
          const afterAssets = tilemap[nextY][nextXX] || OUT_OF_MAP
          const isAfterAssetsGround = isGround(afterAssets)
          // ground assets
          if (isAfterAssetsGround) {
            movements[movements.length - 1].remove = nextMoveable
            movements.push({
              coord: { y: nextY, x: nextXX },
              add: nextMoveable,
            })
          }
        }
      }
      if (isMoveable || movements.length > 2) {
        return computeMovements(oldState, movements)
      }
    }
    return oldState
  })
}

export function computeMovementY(mapState, player, direction) {
  console.log('Computing Y:', mapState, player, direction)
  mapState.set((oldState) => {
    const { tilemap, rows } = mapState.get()
    const nextYY = player.y + 2 * direction
    const nextY = player.y + direction
    const nextX = player.x
    // within range
    if (nextY < rows && nextY > -1) {
      const assets = tilemap[nextY][nextX]
      const isMoveable = isGround(assets)
      const movements = [
        { coord: player, remove: Dictionary.Player },
        {
          coord: { y: nextY, x: nextX },
          add: Dictionary.Player,
        },
      ]
      // ground assets
      if (!isMoveable) {
        const nextMoveable = (tilemap[nextY][nextX] || OUT_OF_MAP).find(
          (item) =>
            item === Dictionary.MoveableBox || item === Dictionary.RescuableBox,
        )
        // next moveable assets
        if (nextMoveable) {
          const afterAssets =
            (tilemap[nextYY] || EMPTY_LIST)[nextX] || OUT_OF_MAP
          const isAfterAssetsGround = isGround(afterAssets)
          // ground assets
          if (isAfterAssetsGround) {
            movements[movements.length - 1].remove = nextMoveable
            movements.push({
              coord: { y: nextYY, x: nextX },
              add: nextMoveable,
            })
          }
        }
      }
      if (isMoveable || movements.length > 2) {
        return computeMovements(oldState, movements)
      }
    }
    return oldState
  })
}

export default {
  [Keys.ArrowUp]: (mapState, player) => computeMovementY(mapState, player, -1),
  [Keys.ArrowDown]: (mapState, player) => computeMovementY(mapState, player, 1),
  [Keys.ArrowLeft]: (mapState, player) =>
    computeMovementX(mapState, player, -1),
  [Keys.ArrowRight]: (mapState, player) =>
    computeMovementX(mapState, player, 1),
}
