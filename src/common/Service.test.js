import { deserializeMapFromId, serializeMapAsId } from './Service'

describe('Service', () => {
  test('if Service parse token into tile', () => {
    expect(deserializeMapFromId('023+010+000')).toEqual([
      [['None'], ['RescuableBlock'], ['RescuePoint']],
      [['None'], ['Player'], ['None']],
      [['None'], ['None'], ['None']],
    ])
  })

  test('if Service parse tile into token', () => {
    expect(
      serializeMapAsId([
        [['None'], ['RescuableBlock'], ['RescuePoint']],
        [['None'], ['Player'], ['None']],
        [['None'], ['None'], ['None']],
      ]),
    ).toEqual('023+010+000')
  })
})
