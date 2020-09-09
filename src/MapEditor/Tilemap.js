export const Dictionary = {
  Player: 'Player',
  Wall: 'Wall',
  MoveableBox: 'MoveableBlock',
  RescuableBox: 'RescuableBlock',
  RescuePoint: 'RescuePoint',
  None: 'None',
}

export const options = [[Dictionary.None, Dictionary.None]].concat(
  Object.entries(Dictionary).filter(([, value]) => value !== Dictionary.None),
)

export const TileNumberMap = {
  [Dictionary.Player]: 1,
  [Dictionary.RescuableBox]: 2,
  [Dictionary.RescuePoint]: 3,
  [Dictionary.MoveableBox]: 4,
  [Dictionary.Wall]: 5,
}
export const NumberTileMap = {
  [1]: Dictionary.Player,
  [2]: Dictionary.RescuableBox,
  [3]: Dictionary.RescuePoint,
  [4]: Dictionary.MoveableBox,
  [5]: Dictionary.Wall,
}

/**
 * Convert tile into token
 * @param {string} tile
 * @return {number|''}
 */
export function convertTileToToken(tile) {
  return TileNumberMap[tile] || 0
}

/**
 * Convert token into tile
 * @param {number} token
 * @returns {string}
 */
export function convertTokenToTile(token) {
  return NumberTileMap[token.toString()] || Dictionary.None
}

const DEFAULT_TILEMAP = [
  [[Dictionary.None], [Dictionary.RescuableBox], [Dictionary.RescuePoint]],
  [[Dictionary.None], [Dictionary.Player], [Dictionary.None]],
  [[Dictionary.None], [Dictionary.MoveableBox], [Dictionary.None]],
]
const EMPTY_ARRAY = []

export function serializeMap(tilemap) {
  return JSON.stringify(tilemap)
}

export function factoryTilemap(
  rows,
  columns,
  existingTilemap = DEFAULT_TILEMAP,
) {
  return Array.from({ length: rows }).map((row, rowIndex) =>
    Array.from({ length: columns }).map(
      (column, columnIndex) =>
        (existingTilemap[rowIndex] || EMPTY_ARRAY)[columnIndex] || [
          Dictionary.None,
        ],
    ),
  )
}
