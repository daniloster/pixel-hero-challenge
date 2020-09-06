import ObservableState from '../../common/ObservableState'
import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'
import GameState from '../GameState'

const className = new CSS('toolbar')
className.scope(
  `
padding: 0.5rem 0;
display: flex;
justify-content: center;
`,
)
className.scope('button', 'padding: 0.5rem;')
className.scope('*:last-child', 'display: none;')
className.modifier('.gameOver *:last-child', 'display: block;')
className.modifier('.gameOver *:not(:last-child)', 'display: none;')

export default function Toolbar({ state, onExit }) {
  return new Component('div', {
    className,
    classList: ObservableState.observeTransform(state, (value) => ({
      gameOver: value.includes(GameState.GameOver),
    })),
    children: [
      new Component('button', {
        attrs: { type: 'button' },
        children: 'Exit',
        events: {
          click: (e) => {
            state.set((old) => {
              if (old.includes(GameState.Succeed)) {
                onExit()
                return old
              }
              return [GameState.GameOver]
            })
          },
        },
      }),
      new Component('div', {
        children: 'Click outside to close.',
      }),
    ],
  })
}
