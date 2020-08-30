import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'

const className = new CSS('player')
className.modifier('.shake', 'animation: shake 0.5s ease infinite;')
className.scope('padding: 0.2rem;')
className.scope('> div', 'background-color: yellow; width: 100%; height: 100%;')

export default function Player() {
  return new Component('div', {
    className,
    children: [new Component('div')],
  })
}
