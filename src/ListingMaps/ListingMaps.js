import ObservableState from '../common/ObservableState'
import Service from '../common/Service'
import Component from '../common/ui/Component'
import CSS from '../common/ui/CSS'
import countMaps from '../countMaps'
import Challenge from './Challenge'

const className = new CSS('listing-maps')
className.scope('font-size: 0.7rem;')
className.scope(['h2', 'p'], 'padding: 0.2rem;')
className.scope(
  '.games',
  'display: grid; grid-template-columns: repeat(auto-fit, 340px); grid-gap: 1rem; justify-content: center;',
)
className.media(
  'screen and (min-width: 500px)',
  '.games',
  'grid-template-columns: repeat(auto-fit, 480px);',
)

export default function ListingMaps() {
  const page = ObservableState.create(0)
  const data = ObservableState.create([])

  ObservableState.observe([page, countMaps], (pageIndex, totalMaps) => {
    Service.listMaps(pageIndex, totalMaps).then((tilemaps) => {
      data.set(() => tilemaps)
    })
  })

  return new Component('div', {
    className,
    children: [
      new Component('h2', {
        children: 'Challenges',
      }),
      new Component('p', {
        children: 'Pick a challenge and show off how clever you are...',
      }),
      new Component('div', {
        className: className.for('games'),
        children: ObservableState.observeTransform(data, (values) =>
          values.map((item) => new Challenge(item)),
        ),
      }),
    ],
  })
}
