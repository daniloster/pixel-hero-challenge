import Component from '../ui/Component'

export default function Icon({ name }) {
  return new Component('i', {
    className: `fa fa-${name}`,
    attrs: { 'aria-hidden': true },
  })
}
