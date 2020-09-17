import ObservableState from '../common/ObservableState'
import Component from '../common/ui/Component'
import StyleBuilder from '../common/ui/StyleBuilder'
import MAP_TILEMAP from './MAP_TILEMAP'
import { Dictionary, options } from './Tilemap'

const className = new StyleBuilder('tile-picker')
className`
  z-index: 20;
`
className.scope('.content')`
  max-width: calc(300px + 1rem);
  padding: 0.5rem;
  margin: 0.5rem;
  background-color: #fff;
  border-radius: 7px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  box-shadow: 0 0 1rem 1px rgba(0, 0, 0, 0.4);
`
className.scope('button')`
  width: 100px;
  height: 100px;
  box-sizing: border-box;
  border: 3px solid #fff;
  background-color: #c0c0c0;
`
className.scope('button.selected')`
  border: 3px solid rgb(30, 200, 78);
`

const DATA_VALUE = 'data-value'
const NONE = [Dictionary.None]

export default function TilePicker({
  className: extClassName,
  value,
  setTilemap,
}) {
  const click = ObservableState.observeTransform(setTilemap, (set) => {
    return (e) => {
      const dataValue = e.currentTarget.getAttribute(DATA_VALUE)

      set(dataValue ? [dataValue] : NONE)
    }
  })

  return new Component('div', {
    attrs: { role: 'tooltip' },
    className: className.with([extClassName]),
    children: [
      new Component('div', {
        className: className.for('content'),
        children: [
          ...options.map((option) => new TileOption({ click, option, value })),
        ],
      }),
    ],
  })
}

function TileOption({ click, option, value }) {
  const [_, tokenValue] = option
  console.log({ tokenValue })
  return new Component('button', {
    attrs: {
      type: 'button',
      [DATA_VALUE]: tokenValue,
    },
    classList: {
      [className.for('selected')]: value[0] === tokenValue,
    },
    events: { click },
    children: [new MAP_TILEMAP[tokenValue]({ key: tokenValue })],
  })
}
