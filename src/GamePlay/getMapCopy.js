import { Dictionary } from '../MapEditor/Tilemap'

export default function getMapCopy(map) {
  const tilemap = map.get()
  return {
    tilemap: tilemap.map((columns) =>
      columns.map((assets) =>
        assets.filter((item) => item !== Dictionary.None),
      ),
    ),
    rows: tilemap.length,
    columns: (tilemap[0] || []).length,
  }
}
