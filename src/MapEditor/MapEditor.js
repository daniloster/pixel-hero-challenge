// import MapInput from './MapInput'
import Modal from '../common/components/Modal'
import ObservableState from '../common/ObservableState'
import Component from '../common/ui/Component'
import CSS from '../common/ui/CSS'
import GamePlay from '../GamePlay/GamePlay'
import MapDimension from './MapDimension'
import MapInput from './MapInput'
import MapRendering from './MapRendering'
import { factoryTilemap, serializeMap } from './Tilemap'
import isButtonDisabled from './validations/isButtonDisabled'
import toValidationMessages from './validations/toValidationMessages'
import ValidationMessages from './validations/ValidationMessages'

const classNameProof = new CSS('modal-map-editor-proof')
classNameProof.scope(
  '> .container > .content > div',
  `
  width: 80vw;
  height: 80vh;
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 100%;
  `,
)
classNameProof.scope(
  '> .container > .content > div > div',
  `
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 100%;
  display: flex;
  flex-direction: column;
  `,
)
const className = new CSS('map-editor')
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
      tilemap: factoryTilemap(3, 3),
    },
  ])
  const mapDimensionActions = {
    onChangeColumns: (e) =>
      observableState.set((old) => ({
        ...old,
        columns: Number(e.target.value),
        tilemap: factoryTilemap(old.rows, Number(e.target.value)),
      })),
    onChangeRows: (e) =>
      observableState.set((old) => ({
        ...old,
        rows: Number(e.target.value),
        tilemap: factoryTilemap(Number(e.target.value), old.columns),
      })),
  }
  const tilemapActions = {
    setTilemap: ({ rowIndex, columnIndex, value }) =>
      observableState.set((old) => ({
        ...old,
        tilemap: old.tilemap.map((columns, currentRowIndex) =>
          columns.map((cell, currentColumnIndex) => {
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
  const tilemap = ObservableState.observeTransform(
    observableState,
    ({ tilemap: rawTilemap }) => rawTilemap,
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
  const gamePlay = new GamePlay({
    serialized: ObservableState.observeTransform(tilemap, serializeMap),
    isMapEditor: true,
    isCompact: false,
    onExit: () => {
      modal.close()
    },
  })
  const modal = new Modal({
    className: classNameProof,
    children: [
      new Component('div', {
        children: [gamePlay],
      }),
    ],
    onOpen: () => {
      gamePlay.restart()
    },
  })
  return new Component('div', {
    className: 'MapSubmission',
    children: [
      new Component('h3', { children: 'Validations' }),
      new ValidationMessages({ messages }),
      new Component('button', {
        attrs: { type: 'button', disabled },
        events: {
          /**
           * @param {Event} e
           */
          click: (e) => {
            e.stopPropagation()
            modal.open()
          },
        },
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
