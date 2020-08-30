import ObservableState from '../common/ObservableState'
import Component from '../common/ui/Component'
import CSS from '../common/ui/CSS'
import TilemapCell from './TilemapCell'

const className = new CSS('container')
className.scope(`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`)

export default function MapInput({ tilemap, setTilemap }) {
  className.scope(
    '.tile',
    ObservableState.observeTransform(
      tilemap,
      (matrix) => `width: ${100 / (matrix[0] || []).length}%;`,
    ),
  )
  const children = ObservableState.observeTransform(
    tilemap,
    (tilemapValues, oldChildren) => {
      const childNodes = []
      tilemapValues.forEach((cells, rowIndex) =>
        cells.forEach((_, columnIndex) => {
          const key = `tilemap-${rowIndex}-${columnIndex}`
          childNodes.push(
            (oldChildren || []).find((oldCell) => oldCell.key === key) ||
              new TilemapCell({
                className: 'tile',
                key,
                rowIndex,
                columnIndex,
                tilemap,
                setTilemap,
              }),
          )
        }),
      )

      return childNodes
    },
  )
  return new Component('div', {
    className,
    children,
  })
}
