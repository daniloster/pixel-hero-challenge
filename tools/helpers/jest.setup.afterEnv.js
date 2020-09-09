// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import noop from '../../src/common/noop'
import mockMatchAll from './mockMatchAll'
import mockMutationObserver from './mockMutationObserver'
import mockNavigator from './mockNavigator'
import mockTextCoders from './mockTextCoders'
import delay from './tests/delay'

beforeEach(() => {
  document.body.innerHTML = ''
  global.delay = delay
  mockMatchAll()
  mockMutationObserver()
  mockNavigator()
  mockTextCoders()
  HTMLElement.prototype.scrollIntoView = noop
  localStorage.setItem('language', '')
  jest.useRealTimers()
})
