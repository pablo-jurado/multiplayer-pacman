import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import { log } from './App'

function Tile (tiles) {
  let classVal = 'square'
  const tilesNum = mori.count(tiles)
  let tilesArr = []

  for (let i = 0; i < tilesNum; i++) {
    const item = mori.get(tiles, i)

    if (item === 0) classVal = 'square'
    if (item === 1) classVal = 'square wall'
    if (item === 2) classVal = 'square dot'
    if (item === 3) classVal = 'square power-dot'
    if (typeof item === 'string') classVal = 'square'

    tilesArr.push(<div key={i} className={classVal} />)
  }
  return tilesArr
}

export default Tile
