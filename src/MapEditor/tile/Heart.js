import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'
import HeartIcon from '../../icons/HeartIcon'

export default function Heart({ key }) {
  const className = new CSS('heart')
  className.scope('padding: 0.7rem;')
  className.scope('> .pulsingHeart', `animation: pulse 1s ease infinite;`)

  return new Component('div', {
    className,
    children: [new HeartIcon({ className: 'pulsingHeart' })],
    key,
  })
}
