import ObservableState from '../ObservableState'
import Component from '../ui/Component'
import CSS from '../ui/CSS'

const className = new CSS('count-down')
className.scope('width: 100%; height: 4rem; font-size: 3rem; display: none;')
className.modifier(
  '.animating',
  ' display: flex; flex-direction: row; align-items: center; justify-content: center;',
)
className.modifier('.animating div', 'animation: modal-in 1s ease;')

export default function CountDown({ countDown }) {
  const animation = new Component('div', {
    children: ObservableState.observeTransform(countDown, (value) =>
      value > 0 ? value : 'Go!',
    ),
  })
  animation.node().addEventListener('animationend', () => {
    countDown.set((old) => (old -= 1))
    const el = animation.node().parentNode
    CSS.refreshAnimation(el)
  })
  return new Component('div', {
    className,
    classList: ObservableState.observeTransform(countDown, (value) => ({
      animating: value > -1,
    })),
    children: [animation],
  })
}
