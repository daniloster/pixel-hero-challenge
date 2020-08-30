import Component from '../common/Component'
import CSS from '../common/CSS'
import ObservableState from '../common/reactive/ObservableState'
import { options } from './Tilemap'

const containerClassName = new CSS('container')
containerClassName.scope('select', 'width: 100%;')

const DATA_ROW_INDEX = 'data-row-index'
const DATA_COLUMN_INDEX = 'data-column-index'

export default function TilemapCell({
  className = '',
  key,
  rowIndex,
  columnIndex,
  tilemap,
  setTilemap,
}) {
  const change = ObservableState.observeTransform(setTilemap, (set) => {
    return (e) => {
      const rowIndex = Number(e.target.getAttribute(DATA_ROW_INDEX))
      const columnIndex = Number(e.target.getAttribute(DATA_COLUMN_INDEX))
      set({
        rowIndex,
        columnIndex,
        value: e.target.value,
      })
    }
  })
  const value = ObservableState.observeTransform(tilemap, (tilemapValues) => {
    return tilemapValues[rowIndex][columnIndex]
  })

  return new Component('div', {
    key,
    className: `${containerClassName} ${className}`,
    children: [
      new Component('select', {
        attrs: {
          [DATA_ROW_INDEX]: rowIndex,
          [DATA_COLUMN_INDEX]: columnIndex,
          value,
        },
        events: { change },
        children: [
          ...options.map(
            (option) => new Option({ option, selectedValue: value }),
          ),
        ],
      }),
    ],
  })
}

function Option({ option, selectedValue }) {
  const [optionLabel, optionValue] = option
  const selected = ObservableState.observeTransform(
    selectedValue,
    (value) => value === optionValue,
  )
  return new Component('option', {
    attrs: { value: optionValue, selected },
    children: optionLabel,
    key: optionLabel,
  })
}
