import ObservableState from '../common/ObservableState'
import Component from '../common/ui/Component'
import CSS from '../common/ui/CSS'
import { UNIT_SIZE } from '../common/units'
import GameState from '../GamePlay/GameState'
import MoveableBox from './tile/MoveableBox'
import Player from './tile/Player'
import RescuableBox from './tile/RescuableBox'
import RescuePoint from './tile/RescuePoint'
import Wall, { WALL_COLOR } from './tile/Wall'
import { Dictionary } from './Tilemap'

const className = new CSS('map-rendering')
className.scope(`--unitSize: ${UNIT_SIZE}px;`)
className.scope('box-sizing: border-box; cursor: default;')
className.scope(
  `padding: calc(var(--unitSize) / 2); background-color: ${WALL_COLOR};`,
)
// className.scope('width: 100%;')
// className.scope('height: 100%;')
className.scope('width: calc((var(--columns) + 1) * var(--unitSize) * 1px);')
className.scope('height: calc((var(--rows) + 1) * var(--unitSize) * 1px);')
className.scope('.MapArea', 'position: relative; background-color: #c0c0c0;')
className.scope(
  '.MapArea',
  'width: calc(var(--columns) * var(--unitSize) * 1px); left: calc((var(--unitSize) / 2) * 1px);',
)
className.scope(
  '.MapArea',
  'height: calc(var(--rows) * var(--unitSize) * 1px); top: calc((var(--unitSize) / 2) * 1px);',
)

const INITIAL_TILEMAP = [[[]]]

/**
 *
 * @param {{ target: HTMLElement, viewport: import('../common/types').Viewport }} params
 */
function defaultUnit({ target, viewport }) {
  const columns = Number(target.getAttribute('data-columns')) + 1
  const rows = Number(target.getAttribute('data-rows')) + 1
  const width = viewport.width()
  const height = viewport.height()
  const unitW = Math.floor(width / columns)
  const unitH = Math.floor(height / rows)
  const unit = Math.min(unitW, unitH)
  if (unit > 0) {
    target.width = columns * unit
    target.height = rows * unit
    target.style.setProperty('--unitSize', unit)
  }
}

export default function MapRendering({
  viewport,
  columns,
  rows,
  state,
  tilemap,
  unit = defaultUnit,
}) {
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
                  column: columnIndex,
                  row: rowIndex,
                  tilemap,
                }),
              ),
          )
        }),
      )

      return childNodes
    },
  )

  const _columns = ObservableState.observeTransform(columns)
  const _rows = ObservableState.observeTransform(rows)

  const component = new Component('div', {
    className,
    attrs: {
      'data-columns': _columns,
      'data-rows': _rows,
    },
    style: {
      '--columns': _columns,
      '--rows': _rows,
    },
    onResize: (view) => unit({ ...view, viewport }),
    children: [
      new Component('div', {
        className: 'MapArea',
        children,
        style: {
          '--columns': _columns,
          '--rows': _rows,
        },
      }),
    ],
  })

  if (state) {
    ObservableState.observeTransform(state, (stateValues) => {
      if (stateValues.includes(GameState.Running)) {
        unit({ target: component.node(), viewport })
      }
    })
  }

  return component
}

const classNameTile = new CSS('tile')
classNameTile.scope(
  `position: absolute; width: calc(var(--unitSize) * 1px); height: calc(var(--unitSize) * 1px);`,
)
classNameTile.scope(`left: calc(var(--column) * var(--unitSize) * 1px);`)
classNameTile.scope(`top: calc(var(--row) * var(--unitSize) * 1px);`)
classNameTile.scope(
  '.tile-content',
  'position: relative; height: 100%; width: 100%;',
)
classNameTile.scope(
  '.tile-asset',
  'z-index: var(--z-index); position: absolute; top: 0; right: 0; bottom: 0; left: 0;',
)
classNameTile.scope('.tile-asset > *', 'width: 100%; height: 100%;')

function Tile({ key, column, row, style, tilemap }) {
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
      return new TileContent({ key, assets: tokenValues })
    },
  )

  return new Component('div', {
    key,
    className: classNameTile,
    children,
    style: { '--row': row, '--column': column },
    attrs: {
      'data-testid': ObservableState.observeTransform(
        tokens,
        (tokenValues) => `Tile:${tokenValues.join('|')}`,
      ),
    },
  })
}

function TileContent({ key, assets }) {
  return new Component('div', {
    className: 'tile-content',
    key,
    children: assets.map(
      (tokenValue, index) =>
        new Component('div', {
          className: 'tile-asset',
          key,
          style: { '--z-index': index + 1 },
          children: [new MAP_TILEMAP[tokenValue]({ key })],
        }),
    ),
  })
}

const MAP_TILEMAP = {
  [Dictionary.MoveableBox]: MoveableBox,
  [Dictionary.RescuableBox]: RescuableBox,
  [Dictionary.Player]: Player,
  [Dictionary.RescuePoint]: RescuePoint,
  [Dictionary.Wall]: Wall,
  [Dictionary.None]: (props) => new Component('div', props),
}
