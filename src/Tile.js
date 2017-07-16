import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import { log } from './App'

function Tile (squares) {
  let classVal = 'square'
  const squaresNum = mori.count(squares)
  let squaresArr = []

  for (let i = 0; i < squaresNum; i++) {
    const item = mori.get(squares, i)

    if (item === 0) classVal = 'square'
    if (item === 1) classVal = 'square wall'
    if (item === 2) classVal = 'square dot'
    if (item === 3) classVal = 'square power-dot'

    squaresArr.push(<div key={i} className={classVal} />)
  }
  return squaresArr
}

export default Tile
