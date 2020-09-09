import Grid from '../common/components/Grid'
import ObservableState from '../common/ObservableState'
import Link from '../common/router/Link'
import Service from '../common/Service'
import Component from '../common/ui/Component'
import CSS from '../common/ui/CSS'
import countMaps from '../countMaps'
import MapRendering from '../MapEditor/MapRendering'

const className = new CSS('listing-maps')

function getBounds(rowData) {
  const rows = rowData.tilemap.length + 1
  const columns = (rowData.tilemap[0] || []).length + 1
  const ratioWidth = 200 / columns
  const ratioHeight = 200 / rows
  // console.log({ ratioWidth, ratioHeight, columns, rows })
  const ratio = Math.floor(Math.min(ratioWidth, ratioHeight))
  const width = ObservableState.create(ratio * columns)
  const height = ObservableState.create(ratio * rows)
  return {
    style: {
      'max-width': width,
      'max-height': height,
      position: 'relative',
    },
  }
}

export default function ListingMaps() {
  const page = ObservableState.create(0)
  const data = ObservableState.create([])

  ObservableState.observe([page, countMaps], (pageIndex, totalMaps) => {
    Service.listMaps(pageIndex, totalMaps).then((tilemaps) => {
      data.set(() => tilemaps)
    })
  })

  return new Component('div', {
    className,
    children: [
      new Component('h2', {
        children: 'Challenges',
      }),
      new Component('p', {
        children: 'Pick a challenge and show off how clever you are...',
      }),
      new Grid({
        data,
        rowMaxWidth: '50%',
        columns: [
          {
            content: ({ rowData }) => rowData.dimension.toString(),
            head: () => 'Area (blocks²)',
          },
          {
            content: ({ rowData }) => rowData.score.toString(),
            head: () => 'Score',
          },
          {
            content: ({ rowData }) =>
              new Date(rowData.timestamp).toLocaleDateString(),
            head: () => 'Created at',
          },
          {
            content: ({ rowData }) =>
              new Link({ to: `/challenge/${rowData.id}`, children: 'Play' }),
            head: () => 'Play',
          },
          {
            content: ({ rowData }) =>
              new Component('div', {
                ...getBounds(rowData),
                children: [
                  new MapRendering({
                    tilemap: [rowData.tilemap],
                    columns: (rowData.tilemap[0] || EMPTY_LIST).length,
                    rows: rowData.tilemap.length,
                    viewport: {
                      width: () => 100,
                      height: () => 100,
                    },
                  }),
                ],
              }),
            head: () => 'Map',
          },
        ],
      }),
    ],
  })
}
