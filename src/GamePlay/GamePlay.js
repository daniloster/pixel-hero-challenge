import ObservableState from '../common/ObservableState'
import Component from '../common/ui/Component'
import CSS from '../common/ui/CSS'
import { Dictionary } from '../MapEditor/Tilemap'
import { ComputeDirection } from './computeMovement'
import GameState from './GameState'
import Keys from './Keys'
import GameOver from './states/GameOver'
import GameRunning from './states/GameRunning'
import Toolbar from './states/Toolbar'

function useGameMap(serialized) {
  return ObservableState.observeTransform(serialized, (json) =>
    JSON.parse(json),
  )
}

// function copy(obj) {
//   return JSON.parse(JSON.stringify(obj))
// }

function getMapCopy(map) {
  const tilemap = map.get()
  return {
    tilemap: tilemap.map((columns) =>
      columns.map((assets) =>
        assets.filter((item) => item !== Dictionary.None),
      ),
    ),
    rows: tilemap.length,
    columns: (tilemap[0] || []).length,
  }
}

const FPS = 25
const INTERVAL = 1000 / FPS

function useGameLoop(map) {
  let actions = {}
  const onKeyDown = (e) => {
    console.log('down:', e.key)
    if (Keys[e.key] && !actions[e.key]) {
      console.log('down adding:', e.key)
      actions[e.key] = true
    }
  }
  const onKeyUp = (e) => {
    console.log('up:', e.key)
    if (Keys[e.key] && actions[e.key]) {
      console.log('up removing:', e.key)
      actions[e.key] = false
    }
  }
  let gameLoopRef = null
  const mapState = ObservableState.observeTransform(getMapCopy(map))
  const gameState = ObservableState.create([GameState.Initial])
  const restart = () => {
    mapState.set(() => getMapCopy(map))
    gameState.set(() => [GameState.Initial])
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    gameLoopRef = setInterval(() => {
      const inputActions = Object.entries(actions)
      actions = {}
      // console.log('Processing loop:', inputActions)
      processGameLoop(gameState, mapState, inputActions)
    }, INTERVAL)
  }
  ObservableState.observe(gameState, (gameStateValue) => {
    const currentState = gameStateValue[gameStateValue.length - 1]
    switch (currentState) {
      case [GameState.GameOver]:
        clearInterval(gameLoopRef)
        document.removeEventListener('keydown', onKeyDown)
        document.removeEventListener('keyup', onKeyUp)
        break
      case [GameState.Paused]:
        break
      default:
        break
    }
  })

  return [gameState, mapState, restart]
}

function processGameLoop(gameState, mapState, actions) {
  actions.forEach(([action, isActive]) => {
    if (!isActive) {
      return
    }

    if (action === Keys.Escape) {
      gameState.set((old) =>
        old
          .filter((value) => value !== GameState.Paused)
          .concat(GameState.Paused),
      )
    }

    const stackState = gameState.get()
    const currentState = stackState[stackState.length - 1]
    if (currentState === GameState.Running) {
      processGameAction(mapState, action)
    }
  })
}

const Moveable = {
  [Keys.ArrowLeft]: true,
  [Keys.ArrowRight]: true,
  [Keys.ArrowUp]: true,
  [Keys.ArrowDown]: true,
}
function processGameAction(mapState, action) {
  const { tilemap } = mapState.get()
  if (Moveable[action]) {
    let indexColumn = -1
    const indexRow = tilemap.findIndex((currentColumns) => {
      const indexCurrentColumns = currentColumns.findIndex((currentCells) =>
        currentCells.includes(Dictionary.Player),
      )
      if (indexCurrentColumns > -1) {
        indexColumn = indexCurrentColumns
        return true
      }
      return false
    })
    const player = {
      x: indexColumn,
      y: indexRow,
    }
    const compute = ComputeDirection[action]
    compute(mapState, player)
  }
}

const className = new CSS('game-play')

export default function GamePlay({ serialized }) {
  const [state, map, restart] = useGameLoop(useGameMap(serialized))
  const component = new Component('div', {
    className,
    children: [
      // new GamePaused({ state }),
      new GameOver({ state }),
      new GameRunning({ state, map }),
      new Toolbar({ state }),
    ],
  })
  component.restart = restart
  return component
}
