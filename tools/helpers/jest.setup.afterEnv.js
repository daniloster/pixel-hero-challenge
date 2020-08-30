// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import noop from '../../src/common/noop'
import mockMutationObserver from './mockMutationObserver'
import mockNavigator from './mockNavigator'
import delay from './tests/delay'

beforeEach(() => {
  // document.body.removeChild(document.body.firstChild)
  document.body.innerHTML = ''
  global.delay = delay
  String.prototype.matchAll = function (...args) {
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
  mockMutationObserver()
  mockNavigator()
  HTMLElement.prototype.scrollIntoView = noop
  localStorage.setItem('language', '')
  jest.useRealTimers()
})
