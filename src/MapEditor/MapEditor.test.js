import { fireEvent, screen } from '@testing-library/dom'
import render from '../../tools/helpers/tests/render'
import MapEditor from './MapEditor'

describe('MapEditor', () => {
  test('if MapEditor displays correct elements', async () => {
    render(new MapEditor())
    const sliders = await screen.findAllByRole('slider')
    expect(sliders).toHaveLength(2)
    expect(sliders[0].value).toEqual('3')
    expect(sliders[1].value).toEqual('3')
    const selects = await screen.findAllByRole('combobox')
    expect(selects).toHaveLength(9)
  })

  test('if MapEditor updates map input cells by changing columns', async () => {
    render(new MapEditor())
    const sliders = await screen.findAllByRole('slider')
    expect(sliders).toHaveLength(2)
    fireEvent.change(sliders[0], { target: { value: 4 } })
    const selects = await screen.findAllByRole('combobox')
    expect(selects).toHaveLength(12)
  })

  test('if MapEditor updates map input cells by changing rows', async () => {
    render(new MapEditor())
    const sliders = await screen.findAllByRole('slider')
    expect(sliders).toHaveLength(2)
    fireEvent.change(sliders[1], { target: { value: 4 } })
    const selects = await screen.findAllByRole('combobox')
    expect(selects).toHaveLength(12)
  })
})
