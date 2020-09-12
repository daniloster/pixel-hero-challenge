import Component from '../common/ui/Component'
import MoveableBox from './tile/MoveableBox'
import Player from './tile/Player'
import RescuableBox from './tile/RescuableBox'
import RescuePoint from './tile/RescuePoint'
import Wall from './tile/Wall'
import { Dictionary } from './Tilemap'

export default {
  [Dictionary.MoveableBox]: MoveableBox,
  [Dictionary.RescuableBox]: RescuableBox,
  [Dictionary.Player]: Player,
  [Dictionary.RescuePoint]: RescuePoint,
  [Dictionary.Wall]: Wall,
  [Dictionary.None]: (props) => new Component('div', props),
}
