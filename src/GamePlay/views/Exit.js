import IconButton from '../../common/components/IconButton'
import CSS from '../../common/ui/CSS'
import GameState from '../GameState'

const className = new CSS('exit')
const position = `
  position: absolute;
  top: -4rem;
  right: 0;
  z-index: 2;
`
className.scope(position)

export default function Exit({ state, onExit }) {
  return new IconButton({
    className,
    name: 'times',
    size: '3rem',
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
