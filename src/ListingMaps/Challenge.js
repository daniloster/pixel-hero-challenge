import Card from '../common/components/Card'
import Icon from '../common/components/Icon'
import Text from '../common/components/Text'
import ObservableState from '../common/ObservableState'
import history from '../common/router/history'
import Component from '../common/ui/Component'
import CSS from '../common/ui/CSS'
import MapRendering from '../MapEditor/MapRendering'

const className = new CSS('challenge')
className.scope(
  'display: flex; flex-wrap: wrap; flex-direction: row; width: 100%;',
)
className.scope('> section', 'width: 100%;')
className.scope(
  '.wrapper',
  'display: flex; flex-wrap: wrap; flex-direction: row; min-width: 100%;',
)
className.scope(
  '.information',
  'display: flex; flex-wrap: wrap; flex-direction: column; width: 300px; height: 100px; padding: 1rem 0 0.5rem 0;',
)
className.media(
  'screen and (min-width: 500px)',
  '.information',
  'padding: 0 0 0 1rem;',
)
className.scope(
  ['.area', '.score', '.created-at'],
  'display: inline-flex; padding-bottom: 0.5rem;',
)
className.scope('.play', 'font-size: 2rem;')
className.scope(
  ['.play', '.play:hover', '.play:active', '.play:visited'],
  'color: #411eb7;',
)

function getBounds(item) {
  const rows = item.tilemap.length + 1
  const columns = (item.tilemap[0] || []).length + 1
  const ratioWidth = 100 / columns
  const ratioHeight = 100 / rows
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

function info(children, _className) {
  return new Text({
    children: [
      new Component('div', {
        className: className.for(_className),
        children,
      }),
    ],
  })
}

export default function Challenge(item) {
  return new Component('div', {
    className,
    children: [
      new Card({
        className: className.for('wrapper'),
        button: {
          children: [new Icon({ name: 'gamepad' })],
          click: () => history.push(`/challenge/${item.id}`),
        },
        children: [
          new Component('div', {
            ...getBounds(item),
            children: [
              new MapRendering({
                tilemap: [item.tilemap],
                columns: (item.tilemap[0] || EMPTY_LIST).length,
                rows: item.tilemap.length,
                viewport: {
                  width: () => 100,
                  height: () => 100,
                },
              }),
            ],
          }),
          new Component('div', {
            className: className.for('information'),
            children: [
              info(`Area (blocks²): ${item.dimension.toString()}`, 'area'),
              info(`Score: ${item.score.toString()}`, 'score'),
              info(
                `Created at: ${new Date(item.timestamp).toLocaleDateString()}`,
                'created-at',
              ),
            ],
          }),
        ],
      }),
    ],
  })
}
