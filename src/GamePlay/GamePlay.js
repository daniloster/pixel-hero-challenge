import noop from '../common/noop'
import ObservableState from '../common/ObservableState'
import Component from '../common/ui/Component'
import CSS from '../common/ui/CSS'
import GameState from './GameState'
import getMapCopy from './getMapCopy'
import Keys from './Keys'
import processGameLoop from './processGameLoop'
import GameFinished from './states/GameFinished'
import GameOver from './states/GameOver'
import GameRunning from './states/GameRunning'
import Toolbar from './states/Toolbar'

const FPS = 25
const INTERVAL = 1000 / FPS

function useGameMap(serialized) {
  return ObservableState.observeTransform(serialized, (json) =>
    JSON.parse(json),
  )
}

function useGameLoop(map) {
  let actions = {}
  const onKeyDown = (e) => {
    if (Keys[e.key] && !actions[e.key]) {
      actions[e.key] = true
    }
  }
  const onKeyUp = (e) => {
    if (Keys[e.key] && actions[e.key]) {
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
      processGameLoop(gameState, mapState, inputActions)
    }, INTERVAL)
  }
  ObservableState.observe(gameState, (gameStateValue) => {
    const currentState = gameStateValue[gameStateValue.length - 1]
    switch (currentState) {
      case [GameState.GameOver]:
      case [GameState.Succeed]:
        clearInterval(gameLoopRef)
        document.removeEventListener('keydown', onKeyDown)
        document.removeEventListener('keyup', onKeyUp)
        break
      default:
        break
    }
  })

  return [gameState, mapState, restart]
}

const className = new CSS('game-play')

export default function GamePlay({ serialized, isMapEditor, onExit = noop }) {
  const [state, map, restart] = useGameLoop(useGameMap(serialized))
  const component = new Component('div', {
    className,
    children: [
      new GameFinished({ state, map, isMapEditor }),
      new GameOver({ state }),
      new GameRunning({ state, map }),
      new Toolbar({ state, onExit }),
    ],
  })
  component.restart = restart
  return component
}
