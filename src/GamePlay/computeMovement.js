import { Dictionary } from '../MapEditor/Tilemap'
import Keys from './Keys'

function isGround(assets) {
  return (
    assets.length === 0 ||
    (assets.length === 1 && assets[0] === Dictionary.RescuePoint)
  )
}

const OUT_OF_MAP = [Dictionary.None]
const EMPTY_LIST = []

export function computeMovementX(mapState, player, direction) {
  console.log('Computing X:', mapState, player, direction)
  mapState.set((oldState) => {
    const { tilemap, columns } = mapState.get()
    const nextXX = player.x + 2 * direction
    const nextX = player.x + direction
    const nextY = player.y
    // within range
    if (nextX < columns && nextX > -1) {
      const assets = tilemap[nextY][nextX]
      const isMoveable = isGround(assets)
      // ground assets
      if (isMoveable) {
        return {
          ...oldState,
          tilemap: tilemap.map((columns, rowIndex) =>
            columns.map((cells, columnIndex) => {
              if (rowIndex === player.y && columnIndex === player.x) {
                return cells.filter((item) => item !== Dictionary.Player)
              }
              if (rowIndex === nextY && columnIndex === nextX) {
                return cells.concat(Dictionary.Player)
              }
              return cells
            }),
          ),
        }
      } else {
        const moveable = (tilemap[nextY][nextX] || OUT_OF_MAP).find(
          (item) =>
            item === Dictionary.MoveableBox || item === Dictionary.RescuableBox,
        )
        // moveable assets
        if (moveable) {
          const afterAssets = tilemap[nextY][nextXX] || OUT_OF_MAP
          const isAfterAssetsGround = isGround(afterAssets)
          // ground assets
          if (isAfterAssetsGround) {
            return {
              ...oldState,
              tilemap: tilemap.map((columns, rowIndex) =>
                columns.map((cells, columnIndex) => {
                  if (rowIndex === player.y && columnIndex === player.x) {
                    return cells.filter((item) => item !== Dictionary.Player)
                  }
                  if (rowIndex === nextY && columnIndex === nextX) {
                    return cells
                      .filter((item) => item !== moveable)
                      .concat(Dictionary.Player)
                  }
                  if (rowIndex === nextY && columnIndex === nextXX) {
                    return cells.concat(moveable)
                  }
                  return cells
                }),
              ),
            }
          }
        }
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
      // ground assets
      if (isMoveable) {
        return {
          ...oldState,
          tilemap: tilemap.map((columns, rowIndex) =>
            columns.map((cells, columnIndex) => {
              if (rowIndex === player.y && columnIndex === player.x) {
                return cells.filter((item) => item !== Dictionary.Player)
              }
              if (rowIndex === nextY && columnIndex === nextX) {
                return cells.concat(Dictionary.Player)
              }
              return cells
            }),
          ),
        }
      } else {
        const moveable = (tilemap[nextY][nextX] || OUT_OF_MAP).find(
          (item) =>
            item === Dictionary.MoveableBox || item === Dictionary.RescuableBox,
        )
        // moveable assets
        if (moveable) {
          const afterAssets =
            (tilemap[nextYY] || EMPTY_LIST)[nextX] || OUT_OF_MAP
          const isAfterAssetsGround = isGround(afterAssets)
          // ground assets
          if (isAfterAssetsGround) {
            return {
              ...oldState,
              tilemap: tilemap.map((columns, rowIndex) =>
                columns.map((cells, columnIndex) => {
                  if (rowIndex === player.y && columnIndex === player.x) {
                    return cells.filter((item) => item !== Dictionary.Player)
                  }
                  if (rowIndex === nextY && columnIndex === nextX) {
                    return cells
                      .filter((item) => item !== moveable)
                      .concat(Dictionary.Player)
                  }
                  if (rowIndex === nextYY && columnIndex === nextX) {
                    return cells.concat(moveable)
                  }
                  return cells
                }),
              ),
            }
          }
        }
      }
    }
    return oldState
  })
}

export const ComputeDirection = {
  [Keys.ArrowUp]: (mapState, player) => computeMovementY(mapState, player, -1),
  [Keys.ArrowDown]: (mapState, player) => computeMovementY(mapState, player, 1),
  [Keys.ArrowLeft]: (mapState, player) =>
    computeMovementX(mapState, player, -1),
  [Keys.ArrowRight]: (mapState, player) =>
    computeMovementX(mapState, player, 1),
}
