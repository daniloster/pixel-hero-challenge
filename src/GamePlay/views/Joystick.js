import ObservableState from '../../common/ObservableState'
import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'
import GameState from '../GameState'

const className = new CSS('joystick')
className.scope(`
  width: 100%;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  --unit: 30px;
  display: none;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  opacity: 0.4;
`)
className.modifier('.is-active', 'display: flex;')
className.scope('> *', 'box-sizing: border-box;')
className.scope('> div', 'position: relative; width: 30vw; height: 30vh;')
className.scope(
  '.joystick-pad',
  `
  transform: rotate(45deg);
  --unit: var(--unit);
  width: var(--unit);
  height: var(--unit);
`,
)
className.scope(
  'button',
  `
  border-radius: 50%;
  background-color: transparent;
  border: 0;
  outline: none;
  height: 50%;
  width: 50%;
  `,
)
className.scope(
  'button > i',
  `
  transform: rotate(-45deg);
  border-radius: 50%;
  padding: 0.5rem;
  background-color: #411eb7;
  color: white;
  cursor: pointer;
  font-size: 2rem;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  `,
)

// Ensure touches occur rapidly
const delay = 500
// Sequential touches must be in close vicinity
const minZoomTouchDelta = 10

// Track state of the last touch
let lastTapAt = 0
let lastClientX = 0
let lastClientY = 0
function preventDoubleTapZoom(event) {
  // Exit early if this involves more than one finger (e.g. pinch to zoom)
  if (event.touches.length > 1) {
    return
  }

  const tapAt = new Date().getTime()
  const timeDiff = tapAt - lastTapAt
  const { clientX, clientY } = event.touches[0]
  const xDiff = Math.abs(lastClientX - clientX)
  const yDiff = Math.abs(lastClientY - clientY)
  if (
    xDiff < minZoomTouchDelta &&
    yDiff < minZoomTouchDelta &&
    event.touches.length === 1 &&
    timeDiff < delay
  ) {
    event.preventDefault()
    // Trigger a fake click for the tap we just prevented
    event.target.click()
  }
  lastClientX = clientX
  lastClientY = clientY
  lastTapAt = tapAt
}

export default function Joystick({ joystick, state }) {
  const button = (direction) =>
    new Component('button', {
      attrs: {
        type: 'button',
      },
      events: {
        click: joystick[direction],
        touchstart: preventDoubleTapZoom,
      },
      className: `joysitck-pad-direction-${direction}`,
      children: `<i class="fa fa-arrow-${direction}" aria-hidden="true"></i>`,
      html: true,
    })

  return new Component('div', {
    className,
    classList: ObservableState.observeTransform(state, (stateValues) => ({
      'is-active': stateValues.includes(GameState.Running),
    })),
    children: [
      new Component('div', {
        children: [
          new Component('div', {
            className: 'joystick-pad',
            children: [
              button('up'),
              button('right'),
              button('left'),
              button('down'),
            ],
          }),
        ],
        onResize: ({ target }) => {
          const width = target.offsetWidth
          const height = target.offsetHeight
          const unit = Math.min(width, height)
          target.firstChild.style.setProperty('--unit', unit)
        },
      }),
    ],
  })
}
