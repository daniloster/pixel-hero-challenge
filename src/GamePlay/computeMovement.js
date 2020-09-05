import { Dictionary } from '../MapEditor/Tilemap'
import Keys from './Keys'

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
      const isMoveable =
        assets.length === 0 || assets.includes(Dictionary.RescuePoint)
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
        const hasMoveableAsset =
          assets.includes(Dictionary.MoveableBox) ||
          assets.includes(Dictionary.RescuableBox)
        // moveable assets
        if (hasMoveableAsset) {
          const afterAssets = tilemap[nextY][nextXX] || [Dictionary.None]
          const isAfterAssetsGround =
            afterAssets.length === 0 || assets.includes(Dictionary.RescuePoint)
          // ground assets
          if (assets) {
          }
        }
      }
    }
    return oldState
  })
}

export function computeMovementY(mapState, player, direction) {
  console.log('Computing Y:', mapState, player, direction)
}

export const ComputeDirection = {
  [Keys.ArrowUp]: (mapState, player) => computeMovementY(mapState, player, -1),
  [Keys.ArrowDown]: (mapState, player) => computeMovementY(mapState, player, 1),
  [Keys.ArrowLeft]: (mapState, player) =>
    computeMovementX(mapState, player, -1),
  [Keys.ArrowRight]: (mapState, player) =>
    computeMovementX(mapState, player, 1),
}
