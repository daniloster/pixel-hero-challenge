import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'
import RescuePointIcon from '../../icons/RescuePointIcon'

const className = new CSS('rescue-point')
className.scope('--pulse-color: rgba(142, 68, 173);')
className.scope('--pulse-min-scale: 0.95;')
className.scope('--pulse-max-scale: 3.2;')
className.scope(
  '.pulse-color',
  'animation: pulse-color 1.3s 0s infinite; transform: scale(var(--pulse-min-scale)); transform-origin: 50% 50%;',
)

export default function RescuePoint({ key }) {
  return new Component('div', {
    className,
    children: [
      new RescuePointIcon({ className: className.for('pulse-color') }),
    ],
    key,
  })
}
