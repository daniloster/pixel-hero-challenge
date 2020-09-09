export function matchAll(...args) {
  let pointerIndex = -1
  const groups = matchAll(this, ...args)

  return {
    next: () => {
      if (groups.next) {
        return groups.next()
      }

      pointerIndex += 1
      const group = groups[pointerIndex]
      if (!group) {
        return {
          done: true,
        }
      }

      return group
    },
  }
}

export default function mockMatchAll() {
  if (String.prototype.matchAll !== matchAll) {
    String.prototype.matchAll = matchAll
  }
}
