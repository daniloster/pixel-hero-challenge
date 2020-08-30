import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'
import BoxIcon from '../../icons/BoxIcon'

export default function MoveableBox({ key }) {
  const className = new CSS('box')
  return new Component('div', {
    className,
    children: [new BoxIcon()],
    key,
  })
}
