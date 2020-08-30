import Component from '../common/ui/Component'
import CSS from '../common/ui/CSS'

const LINE_COLOR = '#013a99'
const BG_COLOR = '#63a3cc'

export default function BoxIcon({
  backgroundColor = BG_COLOR,
  lineColor = LINE_COLOR,
} = {}) {
  const className = new CSS('icon')
  className.scope('width: 100%; height: 100%;')
  className.scope(
    ['> svg', '> svg rect', '> svg line'],
    `
    fill: ${backgroundColor};
    stroke: ${lineColor};
    stroke-width: 20;
    position: relative;
    width: 100%;
    height: 100%;
    `,
  )
  className.scope('> svg line', 'stroke-width: 15;')
  const ns = 'http://www.w3.org/2000/svg'

  return new Component('div', {
    className,
    children: [
      new Component('svg', {
        ns,
        attrs: {
          viewBox: '0 0 100 100',
        },
        children: [
          new Component('rect', {
            ns,
            attrs: {
              x: 0,
              y: 0,
              width: 100,
              height: 100,
            },
          }),
          new Component('line', {
            ns,
            attrs: {
              x1: 0,
              y1: 0,
              x2: 100,
              y2: 100,
            },
          }),
          new Component('line', {
            ns,
            attrs: {
              x1: 0,
              y1: 100,
              x2: 100,
              y2: 0,
            },
          }),
        ],
      }),
    ],
  })
}
