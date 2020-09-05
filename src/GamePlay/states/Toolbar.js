import ObservableState from '../../common/ObservableState'
import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'
import GameState from '../GameState'

const className = new CSS('toolbar')
className.scope(
  `
padding: 0.5rem 0;
display: flex;
justify-content: space-between;
`,
)
className.scope('button', 'padding: 0.5rem;')
className.scope('*:last-child', 'display: none;')
className.modifier('.gameOver *:last-child', 'display: block;')
className.modifier('.gameOver *:not(:last-child)', 'display: none;')
className.modifier('.initial *:first-child', 'display: none;')
className.modifier('.initial', 'justify-content: center;')

export default function Toolbar({ state }) {
  return new Component('div', {
    className,
    classList: ObservableState.observeTransform(state, (value) => ({
      gameOver: value.includes(GameState.GameOver),
      initial: value.includes(GameState.Initial),
    })),
    children: [
      new Component('button', {
        attrs: { type: 'button' },
        children: ObservableState.observeTransform(state, (values) =>
          !values.includes(GameState.Running) ? 'Resume' : 'Pause',
        ),
        events: {
          click: (e) => {
            state.set((value) =>
              value !== GameState.Running
                ? GameState.Running
                : GameState.Paused,
            )
          },
        },
      }),
      new Component('button', {
        attrs: { type: 'button' },
        children: 'Exit',
        events: {
          click: (e) => {
            state.set(() => GameState.GameOver)
          },
        },
      }),
      new Component('div', {
        children: 'Click outside to close.',
      }),
    ],
  })
}
