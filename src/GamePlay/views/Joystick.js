import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'

const className = new CSS('joystick')
className.scope('width: 70%; max-width: 300px')

export default function Joystick({ joystick, state }) {
  return new Component('div', {
    className,
    children: [
      new Component('div', {
        children: [],
      }),
    ],
  })
}
