export const Dictionary = {
  Player: 'Player',
  Wall: 'Wall',
  // Bomb: 'Bomb',
  // Heart: 'Heart',
  MoveableBox: 'MoveableBlock',
  RescuableBox: 'RescuableBlock',
  RescuePoint: 'RescuePoint',
  None: 'None',
}

export const options = [[Dictionary.None, Dictionary.None]].concat(
  Object.entries(Dictionary).filter(([, value]) => value !== Dictionary.None),
)

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
