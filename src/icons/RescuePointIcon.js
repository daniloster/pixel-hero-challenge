import Component from '../common/ui/Component'
import CSS from '../common/ui/CSS'

const className = new CSS('icon')
className.scope('width: 100%; height: 100%;')
className.scope(
  '> svg',
  `
  position: relative;
  width: 100%;
  height: 100%;
  `,
)
className.scope('.base', 'fill: #fff;')
className.scope('.st1', 'fill: #6b24f1;')
className.scope('.st2', 'fill: #411ef79c;')
className.scope('.st3', 'fill: #008af0;')

export default function RescuePointIcon(props) {
  const { className: containerClassName = '' } = props || {}
  const ns = 'http://www.w3.org/2000/svg'

  return new Component('div', {
    className,
    children: [
      new Component('svg', {
        ns,
        attrs: {
          viewBox: '0 0 960 960',
        },
        children: [
          Component.build('g', ns, [
            [
              'g',
              ns,
              [
                [
                  {
                    tag: 'circle',
                    attrs: {
                      class: className.for('base'),
                      cx: 960 / 2,
                      cy: 960 / 2,
                      r: (960 - 100) / 2,
                    },
                  },
                  ns,
                ],
                [
                  {
                    tag: 'circle',
                    attrs: {
                      class: className.for('st1'),
                      cx: 960 / 2,
                      cy: 960 / 2,
                      r: 960 / 2.8,
                    },
                  },
                  ns,
                ],
              ],
            ],
            [
              'g',
              ns,
              [
                [
                  {
                    tag: 'circle',
                    attrs: {
                      class: className.for('base'),
                      cx: 960 / 2,
                      cy: 960 / 2,
                      r: 960 / 3.4,
                    },
                  },
                  ns,
                ],
                [
                  {
                    tag: 'circle',
                    attrs: {
                      class: className.for('st2'),
                      cx: 960 / 2,
                      cy: 960 / 2,
                      r: 960 / 3.8,
                    },
                  },
                  ns,
                ],
              ],
            ],
            [
              'g',
              ns,
              [
                [
                  {
                    tag: 'circle',
                    attrs: {
                      class: className.for('base'),
                      cx: 960 / 2,
                      cy: 960 / 2,
                      r: 960 / 5.2,
                    },
                  },
                  ns,
                ],
                [
                  {
                    tag: 'circle',
                    attrs: {
                      class: className.for('st1'),
                      cx: 960 / 2,
                      cy: 960 / 2,
                      r: 960 / 6,
                    },
                  },
                  ns,
                ],
                [
                  {
                    tag: 'circle',
                    attrs: {
                      class: `${className.for('st1')} ${containerClassName}`,
                      cx: 960 / 2,
                      cy: 960 / 2,
                      r: 960 / 6,
                    },
                  },
                  ns,
                ],
              ],
            ],
          ]),
        ],
      }),
    ],
  })
}
