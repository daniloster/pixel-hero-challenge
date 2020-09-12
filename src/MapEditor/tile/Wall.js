import Component from '../../common/ui/Component'
import StyleBuilder from '../../common/ui/StyleBuilder'

export const WALL_COLOR = '#ac7c05'

const className = new StyleBuilder('wall')
className`
  display: flex;
  flex: 1 1 auto;
  background-color: #ac7c05;
  width: 100%;
  height: 100%;
  `

export default function Wall({ key }) {
  return new Component('div', {
    className,
    children: [],
    key,
  })
}
