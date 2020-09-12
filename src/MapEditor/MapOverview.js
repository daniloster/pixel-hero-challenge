import Popper from 'popper.js'
import useClickOutside from '../common/components/useClickOutside'
import Component from '../common/ui/Component'
import StyleBuilder from '../common/ui/StyleBuilder'
import MapRendering from './MapRendering'
import { Dictionary } from './Tilemap'
import TilePicker from './TilePicker'

const className = new StyleBuilder('map-overview')
className`
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: center;
width: 100%;
`
className.scope('h3')`width: 100%;`
className.scope('.tile-button-picker')`
  background-color: transparent;
  border: 1px dotted #fff;
  width: 100%;
  height: 100%;
`

export default function MapOverview({
  setTilemap: set,
  tilemap,
  columns,
  rows,
}) {
  let popper = null
  let unsubscribe = null
  const close = () => {
    if (unsubscribe) {
      popper.destroy()
      unsubscribe()
      unsubscribe = null
    }
  }

  const openPopper = ({ column, row, ref }) => {
    const setTilemap = (value) => {
      set({
        rowIndex: row,
        columnIndex: column,
        value,
      })
      close()
    }
    const tilePicker = new TilePicker({
      setTilemap,
      value: (tilemap.get()[row] || [])[column] || [Dictionary.None],
    })
    close()

    document.body.appendChild(tilePicker.node())
    popper = new Popper(ref, tilePicker.node(), {
      placement: 'auto',
      positionFixed: false,
      removeOnDestroy: true,
    })

    let isOpen = false
    unsubscribe = useClickOutside(tilePicker.node(), (e, isClickingOutside) => {
      if (isClickingOutside && isOpen) {
        close()
      }
      isOpen = true
    })
  }

  return new Component('div', {
    className,
    children: [
      new Component('h3', { children: 'Map Overview' }),
      new Component('div', {
        children: [
          new MapRendering({
            cellRenderer: ({ key, column, row, children }) => {
              const button = new Component('button', {
                className: className.for('tile-button-picker'),
                children,
                key,
                events: {
                  click: (e) => {
                    e.preventDefault()
                    openPopper({ column, row, ref: button.node() })
                  },
                },
              })

              return button
            },
            tilemap,
            columns,
            rows,
            viewport: {
              width: () => window.innerWidth - 16,
              height: () => window.innerHeight * 0.55 - 120,
            },
          }),
        ],
      }),
    ],
  })
}
