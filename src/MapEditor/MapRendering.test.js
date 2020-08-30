import { screen } from '@testing-library/dom'
import render from '../../tools/helpers/tests/render'
import ObservableState from '../common/reactive/ObservableState'
import MapRendering from './MapRendering'
import { Dictionary } from './Tilemap'

describe('MapRendering', () => {
  test('if MapRendering displays empty cells', async () => {
    render(
      new MapRendering({
        columns: ObservableState.create(2),
        rows: ObservableState.create(2),
        tilemap: ObservableState.create([
          [Dictionary.None, Dictionary.None],
          [Dictionary.None, Dictionary.None],
        ]),
      }),
    )
    const tiles = await screen.findAllByTestId(`Tile:${Dictionary.None}`)
    expect(tiles).toHaveLength(4)
  })

  test('if MapRendering displays 1 empty cell, 2 walls, 1 player, 1 moveable box, 2 rescuable boxes and 2 rescue points', async () => {
    render(
      new MapRendering({
        columns: ObservableState.create(3),
        rows: ObservableState.create(3),
        tilemap: ObservableState.create([
          [Dictionary.None, Dictionary.MoveableBox, Dictionary.Player],
          [Dictionary.Wall, Dictionary.RescuableBox, Dictionary.RescuePoint],
          [Dictionary.Wall, Dictionary.RescuableBox, Dictionary.RescuePoint],
        ]),
      }),
    )
    expect(
      await screen.findAllByTestId(`Tile:${Dictionary.None}`),
    ).toHaveLength(1)
    expect(
      await screen.findAllByTestId(`Tile:${Dictionary.MoveableBox}`),
    ).toHaveLength(1)
    expect(
      await screen.findAllByTestId(`Tile:${Dictionary.Player}`),
    ).toHaveLength(1)
    expect(
      await screen.findAllByTestId(`Tile:${Dictionary.Wall}`),
    ).toHaveLength(2)
    expect(
      await screen.findAllByTestId(`Tile:${Dictionary.RescuableBox}`),
    ).toHaveLength(2)
    expect(
      await screen.findAllByTestId(`Tile:${Dictionary.RescuePoint}`),
    ).toHaveLength(2)
  })

  test('if MapRendering updates on changes to properties', async () => {
    const columns = ObservableState.create(3)
    render(
      new MapRendering({
        columns,
        rows: ObservableState.create(3),
        tilemap: ObservableState.create([
          [Dictionary.Wall, Dictionary.Wall, Dictionary.Wall],
          [Dictionary.Wall, Dictionary.Wall, Dictionary.Wall],
          [Dictionary.Wall, Dictionary.Wall, Dictionary.Wall],
        ]),
      }),
    )
    expect(
      await screen.findAllByTestId(`Tile:${Dictionary.Wall}`),
    ).toHaveLength(9)
    columns.set((columnValue) => columnValue + 1)
    expect(columns.get()).toEqual(4)
    expect(
      await screen.findAllByTestId(`Tile:${Dictionary.None}`),
    ).toHaveLength(1)
  })
})
