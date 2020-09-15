import IconButton from '../../common/components/IconButton'
import CSS from '../../common/ui/CSS'
import GameState from '../GameState'

const className = new CSS('exit')
const position = `
  position: absolute;
  top: -3rem;
  right: 0;
  z-index: 2;
`
className.scope(position)

export default function Exit({ state, onExit }) {
  return new IconButton({
    className: className.with(['nes-icon close']),
    classList: { fa: false, 'fa-': false },
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
