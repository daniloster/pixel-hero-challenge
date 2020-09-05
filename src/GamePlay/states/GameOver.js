import ObservableState from '../../common/ObservableState'
import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'
import GameState from '../GameState'

const className = new CSS('game-over')
className.scope('display: none;')
className.modifier('.active', 'display: block;')

export default function GameOver({ state }) {
  return new Component('div', {
    className,
    classList: ObservableState.observeTransform(state, (value) => ({
      active: value === GameState.GameOver,
    })),
    children: [
      new Component('h3', {
        children: "Sorry, it wasn't this time. But, never stop trying...",
      }),
    ],
  })
}
