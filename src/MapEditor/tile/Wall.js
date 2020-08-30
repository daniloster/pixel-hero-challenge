import Component from '../../common/Component'
import CSS from '../../common/CSS'

export const WALL_COLOR = '#ac7c05'

const className = new CSS('wall')
className.scope(
  `display: flex; flex: 1 1 auto; background-color: ${WALL_COLOR};`,
)

export default function Wall({ key }) {
  return new Component('div', {
    className,
    children: [],
    key,
  })
}
