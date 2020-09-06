import CountDown from '../../common/components/CountDown'
import ObservableState from '../../common/ObservableState'
import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'
import MapRendering from '../../MapEditor/MapRendering'
import GameState from '../GameState'

const className = new CSS('game-running')
className.scope('display: none;')
className.modifier('.initial', 'display: block;')
className.modifier('.running', 'display: block;')

export default function GameRunning({ state, map }) {
  const columns = ObservableState.observeTransform(
    map,
    ({ columns }) => columns,
  )
  const rows = ObservableState.observeTransform(map, ({ rows }) => rows)
  const tilemap = ObservableState.observeTransform(
    map,
    ({ tilemap }) => tilemap,
  )
  const countDown = ObservableState.create(-1)
  countDown.subscribe({
    next: (value) => {
      if (value === 0) {
        state.set((values) => {
          if (values.includes(GameState.Initial)) {
            return values
              .filter(
                (value) =>
                  value !== GameState.Initial && value !== GameState.Running,
              )
              .concat(GameState.Running)
          }
          return values
        })
      }
    },
  })
  return new Component('div', {
    className,
    classList: ObservableState.observeTransform(state, (newState) => {
      if (newState.includes(GameState.Initial)) {
        countDown.set(() => 3)
      }
      return {
        initial: newState.includes(GameState.Initial),
        running: newState.includes(GameState.Running),
      }
    }),
    children: [
      new MapRendering({ tilemap, rows, columns }),
      new CountDown({ countDown }),
    ],
  })
}