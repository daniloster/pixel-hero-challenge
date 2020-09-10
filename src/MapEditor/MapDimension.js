import ObservableState from '../common/ObservableState'
import Component from '../common/ui/Component'
import CSS from '../common/ui/CSS'
import { MAX_COLUMNS, MAX_ROWS, MIN_COLUMNS, MIN_ROWS } from '../common/units'

const COLUMN_ID = 'dimensionColumns'
const ROW_ID = 'dimensionRows'

const className = new CSS('map-dimension')
className.scope(
  '.MapDimensionLayout__slider',
  `
  appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  transition: 0.2s;
  transition: opacity 0.2s;
`,
)
className.scope(
  'label',
  `
  display: block;
  padding: 0.5rem 0 0 0;
`,
)
className.scope(
  'label:first-child',
  `
  padding: 0;
`,
)
className.scope(
  '.MapDimensionLayout__slider::-webkit-slider-thumb',
  `
  appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
`,
)
className.scope(
  '.MapDimensionLayout__slider::-moz-range-thumb',
  `
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
`,
)
className.scope(
  '.MapDimensionLayout__limits',
  `
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0 0 0;
`,
)

export default function MapDimension({
  columns,
  rows,
  onChangeColumns,
  onChangeRows,
}) {
  const textColumns = ObservableState.observeTransform(
    columns,
    (value) => `: ${value}`,
  )
  const textRows = ObservableState.observeTransform(
    rows,
    (value) => `: ${value}`,
  )

  return new Component('div', {
    className,
    children: [
      new Component('label', {
        attrs: { for: COLUMN_ID },
        children: [
          new Component('span', {
            children: [
              new Component('b', { children: 'Columns' }),
              new Component('span', { children: textColumns }),
            ],
          }),
          new Component('input', {
            attrs: {
              id: COLUMN_ID,
              type: 'range',
              value: columns,
              min: MIN_COLUMNS,
              max: MAX_COLUMNS,
            },
            className: className.for('MapDimensionLayout__slider'),
            events: { change: onChangeColumns },
          }),
        ],
      }),
      new Component('div', {
        className: className.for('MapDimensionLayout__limits'),
        children: [
          new Component('span', {
            children: MIN_COLUMNS,
          }),
          new Component('span', {
            children: MAX_COLUMNS,
          }),
        ],
      }),
      new Component('label', {
        attrs: { for: ROW_ID },
        children: [
          new Component('span', {
            children: [
              new Component('b', { children: 'Rows' }),
              new Component('span', { children: textRows }),
            ],
          }),
          new Component('input', {
            attrs: {
              id: ROW_ID,
              type: 'range',
              value: rows,
              min: MIN_ROWS,
              max: MAX_ROWS,
            },
            className: className.for('MapDimensionLayout__slider'),
            events: { change: onChangeRows },
          }),
        ],
      }),
      new Component('div', {
        className: className.for('MapDimensionLayout__limits'),
        children: [
          new Component('span', {
            children: MIN_ROWS,
          }),
          new Component('span', {
            children: MAX_ROWS,
          }),
        ],
      }),
    ],
  })
}
