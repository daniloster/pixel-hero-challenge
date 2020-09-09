import ObservableState from '../common/ObservableState'
import Component from '../common/ui/Component'
import CSS from '../common/ui/CSS'
import TilemapCell from './TilemapCell'

const className = new CSS('map-input')
className.scope(`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`)
className.scope('.grouped-columns', '')
className.scope('.tile', `width: calc(100% / var(--columns));`)

export default function MapInput({ tilemap, setTilemap }) {
  const children = ObservableState.observeTransform(
    tilemap,
    (tilemapValues) => {
      const childNodes = []
      tilemapValues.forEach((cells, rowIndex) =>
        cells.forEach((_, columnIndex) => {
          const key = `tilemap-${rowIndex}-${columnIndex}`
          childNodes.push(
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
    style: {
      '--columns': ObservableState.observeTransform(
        tilemap,
        (matrix) => (matrix[0] || []).length,
      ),
    },
  })
}
