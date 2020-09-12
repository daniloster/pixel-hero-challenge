import CSS from './CSS'

describe('CSS', () => {
  test('if CSS creates style markup', () => {
    const className = new CSS('example')
    const markup = document.head.querySelector(`[id="${className}"]`)
    expect(className.styleMarkup.outerHTML).toMatch(
      `<style id="${className}"></style>`,
    )
  })

  test('if CSS creates content', () => {
    const className = new CSS('example')
    className.scope('padding: 0;')

    expect(className.styleMarkup.innerHTML).toMatch(
      `.${className} { padding: 0; }`,
    )
  })

  test('if CSS hash classes', () => {
    const className = new CSS('example')
    expect(className.for('scoped-class')).toEqual(`${className}_scoped-class`)
    expect(className.for('.scoped-class')).toEqual(`.${className}_scoped-class`)
  })

  test('if CSS creates content scoped class', () => {
    const className = new CSS('example')
    className.scope('.scoped-class .another', 'padding: 0;')

    expect(className.styleMarkup.innerHTML).toMatch(
      `.${className} .${className}_scoped-class .${className}_another { padding: 0; }`,
    )
  })

  test('if CSS creates content scoped element', () => {
    const className = new CSS('example')
    className.scope('i', 'padding: 0;')

    expect(className.styleMarkup.innerHTML).toMatch(
      `.${className} i { padding: 0; }`,
    )
  })

  test('if CSS creates content with modifier', () => {
    const className = new CSS('example')
    className.modifier('.modifier', 'padding: 0;')

    expect(className.styleMarkup.innerHTML).toMatch(
      `.${className}.${className}_modifier { padding: 0; }`,
    )
  })

  test('if CSS creates content with scope mixed classes and elements', () => {
    const className = new CSS('example')
    className.scope('a.rocks', 'padding: 0;')

    expect(className.styleMarkup.innerHTML).toMatch(
      `.${className} a.${className}_rocks { padding: 0; }`,
    )
  })

  test('if CSS creates content with modifier pseudo elements', () => {
    const className = new CSS('example')
    className.modifier(':hover', 'padding: 0;')

    expect(className.styleMarkup.innerHTML).toMatch(
      `.${className}:hover { padding: 0; }`,
    )
  })
})
