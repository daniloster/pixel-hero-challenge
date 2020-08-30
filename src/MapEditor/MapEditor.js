// import MapInput from './MapInput'
import Component from '../common/Component'
import CSS from '../common/CSS'
import noop from '../common/noop'
import ObservableState from '../common/reactive/ObservableState'
import { MAX_COLUMNS, MAX_ROWS } from '../common/units'
import MapDimension from './MapDimension'
import MapInput from './MapInput'
import MapRendering from './MapRendering'
import { factoryTilemap } from './Tilemap'
import isButtonDisabled from './validations/isButtonDisabled'
import toValidationMessages from './validations/toValidationMessages'
import ValidationMessages from './validations/ValidationMessages'

const className = new CSS('container')
className.scope(
  'h2',
  `
  padding: 0 0 1rem 0;
  display: flex;
  flex-direction: row;
`,
)
className.scope(
  '.MapSubmission',
  `
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`,
)
className.scope('.MapSubmission h3', `width: 100%;`)
className.scope(
  '.MapEditorItem',
  `
  display: inline-block;
  width: 50%;
`,
)
className.scope(['> :nth-child(3)', '> :nth-child(2)'], 'padding-bottom: 1rem;')
className.scope('.MapEditorItem:nth-child(4)', 'padding: 0 0.5rem 0 0;')
className.scope('.MapEditorItem:nth-child(5)', 'padding: 0 0 0 0.5rem;')

export default function MapEditor() {
  const observableState = ObservableState.observeTransform([
    {
      columns: 3,
      rows: 3,
      tilemap: factoryTilemap(MAX_ROWS, MAX_COLUMNS),
      doable: false,
    },
  ])
  const mapDimensionActions = {
    onChangeColumns: (e) =>
      observableState.set((old) => ({
        ...old,
        columns: Number(e.target.value),
      })),
    onChangeRows: (e) =>
      observableState.set((old) => ({
        ...old,
        rows: Number(e.target.value),
      })),
  }
  const tilemapActions = {
    setTilemap: ({ rowIndex, columnIndex, value }) =>
      observableState.set((old) => ({
        ...old,
        tilemap: old.tilemap.map((cells, currentRowIndex) =>
          cells.map((cell, currentColumnIndex) => {
            if (
              currentColumnIndex === columnIndex &&
              currentRowIndex == rowIndex
            ) {
              return value
            }

            return cell
          }),
        ),
      })),
  }
  const rows = ObservableState.observeTransform(
    observableState,
    ({ rows }) => rows,
  )
  const columns = ObservableState.observeTransform(
    observableState,
    ({ columns }) => columns,
  )
  const rawTilemap = ObservableState.observeTransform(
    observableState,
    ({ tilemap }) => tilemap,
  )
  const tilemap = ObservableState.observeTransform(
    [rawTilemap, rows, columns],
    (rawTilemap, rows, columns) => factoryTilemap(rows, columns, rawTilemap),
  )

  return new Component('div', {
    className,
    children: [
      new Component('h2', { children: 'Map Editor' }),
      new MapDimension({
        ...mapDimensionActions,
        columns,
        rows,
      }),
      new MapSubmission({ tilemap }),
      new MapDefinitions({ ...tilemapActions, tilemap }),
      new MapOverview({ tilemap, columns, rows }),
    ],
  })
}

function MapSubmission({ tilemap }) {
  const messages = ObservableState.observeTransform(
    tilemap,
    toValidationMessages,
  )
  const disabled = ObservableState.observeTransform(messages, isButtonDisabled)
  return new Component('div', {
    className: 'MapSubmission',
    children: [
      new Component('h3', { children: 'Validations' }),
      new ValidationMessages({ messages }),
      new Component('button', {
        attrs: { type: 'button', disabled },
        events: { click: noop },
        children: 'First: can you finish it?',
      }),
    ],
  })
}

function MapDefinitions({ tilemap, setTilemap }) {
  return new Component('div', {
    className: 'MapEditorItem',
    children: [
      new Component('h3', { children: 'Map Definitions' }),
      new MapInput({ tilemap, setTilemap }),
    ],
  })
}

function MapOverview({ tilemap, columns, rows }) {
  return new Component('div', {
    className: 'MapEditorItem',
    children: [
      new Component('h3', { children: 'Map Overview' }),
      new MapRendering({ tilemap, columns, rows }),
    ],
  })
}
