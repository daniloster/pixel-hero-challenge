import ObservableState from '../common/ObservableState'
import Component from '../common/ui/Component'
import CSS from '../common/ui/CSS'
import { UNIT_SIZE } from '../common/units'
import Heart from './tile/Heart'
import MoveableBox from './tile/MoveableBox'
import Player from './tile/Player'
import RescuableBox from './tile/RescuableBox'
import RescuePoint from './tile/RescuePoint'
import Wall, { WALL_COLOR } from './tile/Wall'
import { Dictionary } from './Tilemap'

const className = new CSS('map-rendering')
className.scope(`padding: ${UNIT_SIZE / 2}; background-color: ${WALL_COLOR};`)
className.scope(
  '.MapArea',
  'height: 100%; width: 100%; position: relative; background-color: #c0c0c0;',
)

const INITIAL_TILEMAP = [[[]]]

export default function MapRendering({ tilemap, columns, rows }) {
  className.scope(
    ObservableState.observeTransform(
      columns,
      (value) => `width: ${value * UNIT_SIZE + UNIT_SIZE}px`,
    ),
  )
  className.scope(
    ObservableState.observeTransform(
      rows,
      (value) => `height: ${value * UNIT_SIZE + UNIT_SIZE}px`,
    ),
  )

  const children = ObservableState.observeTransform(
    tilemap,
    (tilemapValues = [[[]]], oldChildren = []) => {
      const childNodes = []
      tilemapValues.forEach((cells, rowIndex) =>
        cells.forEach((_, columnIndex) => {
          const key = `tilemap-${rowIndex}-${columnIndex}`
          const found = (oldChildren || []).find(
            (oldCell) => oldCell.key === key,
          )
          childNodes.push(
            found ||
              childNodes.push(
                new Tile({
                  key,
                  row: rowIndex,
                  column: columnIndex,
                  tilemap,
                }),
              ),
          )
        }),
      )

      return childNodes
    },
  )

  return new Component('div', {
    className,
    children: [
      new Component('div', {
        className: 'MapArea',
        children,
      }),
    ],
  })
}

function Tile({ key, row, column, tilemap }) {
  const className = new CSS('tile')
  className.scope(
    `position: absolute; width: ${UNIT_SIZE}px; height: ${UNIT_SIZE}px;`,
  )
  className.scope(`left: ${column * UNIT_SIZE}px;`)
  className.scope(`top: ${row * UNIT_SIZE}px;`)
  className.scope('> *', 'height: 100%; width: 100%;')

  const tokens = ObservableState.observeTransform(
    tilemap,
    (tilemapValues) => (tilemapValues[row] || [])[column] || [Dictionary.None],
  )
  let oldKey = null
  const children = ObservableState.observeTransform(
    tokens,
    (tokenValues, oldChildren) => {
      const key = `${tokenValues.join('-')}-${row}-${column}`
      if (oldKey === key) {
        return oldChildren
      }
      oldKey = key
      return tokenValues.map(
        (tokenValue) => new MAP_TILEMAP[tokenValue]({ key, column, row }),
      )
    },
  )

  return new Component('div', {
    key,
    className,
    children,
    attrs: {
      'data-testid': ObservableState.observeTransform(
        tokens,
        (tokenValues) => `Tile:${tokenValues.join('|')}`,
      ),
    },
  })
}

const MAP_TILEMAP = {
  [Dictionary.MoveableBox]: MoveableBox,
  [Dictionary.RescuableBox]: RescuableBox,
  [Dictionary.Bomb]: () => new Component('div'),
  [Dictionary.Heart]: Heart,
  [Dictionary.Player]: Player,
  [Dictionary.RescuePoint]: RescuePoint,
  [Dictionary.Wall]: Wall,
  [Dictionary.None]: () => new Component('div'),
}
