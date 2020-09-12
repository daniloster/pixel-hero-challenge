// import MapInput from './MapInput'
import Button from '../common/components/Button'
import Modal from '../common/components/Modal'
import ObservableState from '../common/ObservableState'
import Component from '../common/ui/Component'
import StyleBuilder from '../common/ui/StyleBuilder'
import GamePlay from '../GamePlay/GamePlay'
import MapDimension from './MapDimension'
import MapInput from './MapInput'
import MapRendering from './MapRendering'
import { factoryTilemap, serializeMap } from './Tilemap'
import isButtonDisabled from './validations/isButtonDisabled'
import toValidationMessages from './validations/toValidationMessages'
import ValidationMessages from './validations/ValidationMessages'

const className = new StyleBuilder('map-editor')
className`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 100%;
`
className.scope('.proof-button')`
padding: 0.7rem;
`
className.scope('h2')`
  padding: 0 0 1rem 0;
  width: 100%;
`

className.scope('.MapSubmission')`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  position: fixed;
  height: 4rem;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  box-shadow: 0px 1px 45px -5px rgba(0,0,0,0.75);
  border-top: 1px solid rgba(0, 0, 0, 0.3);
`
className.scope(
  '.MapSubmission p',
)`color: #fff; font-size: 1rem; padding: 0 1rem; margin: 0;`
className.scope('.MapEditorItem')`
  display: inline-block;
  width: 50%;
`
className.scope(['.MapDimension', '.MapDefinitions'])`
  display: inline-flex; flex-direction: column;
`
className.scope('.MapDimension')`
padding: 0 0.5rem 1rem 0; width: 35%;
`
className.scope('.MapDefinitions')`
padding: 0 0 1rem 0.5rem; width: 65%;
`
className.scope('.MapOverview')`display: block;`

export default function MapEditor() {
  const observableState = ObservableState.create({
    columns: 3,
    rows: 3,
    tilemap: factoryTilemap(3, 3),
  })
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
  const messages = ObservableState.observeTransform(
    tilemap,
    toValidationMessages,
  )

  return new Component('div', {
    className,
    children: [
      new Component('h2', { children: 'Map Editor' }),
      new MapDimension({
        ...mapDimensionActions,
        className: className.for('MapDimension'),
        columns,
        rows,
      }),
      new MapDefinitions({
        ...tilemapActions,
        messages,
        tilemap,
      }),
      new MapOverview({ tilemap, columns, rows }),
      new MapSubmission({ messages, tilemap }),
    ],
  })
}

function MapDefinitions({ messages, tilemap, setTilemap }) {
  return new Component('div', {
    className: className.for('MapDefinitions'),
    children: [
      new Component('h3', { children: 'Map Definitions' }),
      new ValidationMessages({ messages }),
      new MapInput({ tilemap, setTilemap }),
    ],
  })
}

function MapOverview({ tilemap, columns, rows }) {
  return new Component('div', {
    className: className.for('MapOverview'),
    children: [
      new Component('h3', { children: 'Map Overview' }),
      new MapRendering({
        tilemap,
        columns,
        rows,
        viewport: {
          width: () => window.innerWidth / 2 - 32,
          height: () => window.innerHeight * 0.4,
        },
      }),
    ],
  })
}

function MapSubmission({ messages, tilemap }) {
  const disabled = ObservableState.observeTransform(messages, isButtonDisabled)
  const modal = new MapSubmissionGamePlay({ tilemap })

  return new Component('div', {
    className: className.for('MapSubmission'),
    style: {
      display: ObservableState.observeTransform(modal.state, (isOpen) =>
        isOpen ? 'none' : 'flex',
      ),
    },
    children: [
      new Component('p', { children: 'Can you finish it?' }),
      new Button({
        state: 'warning',
        className: className.for('proof-button'),
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
        children: 'Prove it!',
      }),
    ],
  })
}

const classNameProof = new StyleBuilder('modal-map-editor-proof')
classNameProof.scope('div.content-wrapper')`
width: 80vw;
height: 80vh;
flex-direction: row;
flex-flow: wrap;
flex-grow: 1;
flex-shrink: 1;
flex-basis: 100%;
display: flex;
padding-top: 2.5rem;
`
classNameProof.scope('.content-wrapper > div')`
overflow-x: visible;
display: flex;
flex-direction: column;
flex-grow: 1;
flex-shrink: 1;
flex-basis: 100%;
`
classNameProof.scope([
  // game finished
  '.content-wrapper > div > *:nth-child(1)',
  // game over
  '.content-wrapper > div > *:nth-child(2)',
])`
overflow-x: hidden;
`

function MapSubmissionGamePlay({ tilemap }) {
  const gameViewport = {
    width: () => window.innerWidth * 0.8,
    height: () => window.innerHeight * 0.8 - 40,
  }
  const gamePlay = new GamePlay({
    serialized: ObservableState.observeTransform(tilemap, serializeMap),
    isMapEditor: true,
    onExit: () => {
      setTimeout(() => modal.close())
    },
    viewport: gameViewport,
  })
  const modalContent = new Component('div', {
    className: classNameProof.for('content-wrapper'),
    children: [gamePlay],
  })
  const modal = new Modal({
    className: classNameProof,
    children: [modalContent],
    onOpen: () => {
      gamePlay.restart()
    },
  })

  return modal
}
