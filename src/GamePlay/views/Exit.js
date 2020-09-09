import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'
import GameState from '../GameState'

const className = new CSS('exit')
className.scope(
  `
position: absolute;
top: -4rem;
right: 0;
z-index: 2;
padding: 0.5rem;
border-radius: 50%;
background-color: transparent;
border: 0;
outline: none;
`,
)
className.scope('i', 'color: #411eb7; cursor: pointer; font-size: 3rem;')

export default function Exit({ state, onExit }) {
  return new Component('button', {
    className,
    attrs: { type: 'button' },
    children: '<i class="fa fa-times" aria-hidden="true" />',
    html: true,
    events: {
      click: (e) => {
        setTimeout(() =>
          state.set((old) => {
            if (old.includes(GameState.Succeed)) {
              return old
            }
            return [GameState.GameOver]
          }),
        )
        onExit()
      },
    },
  })
}
