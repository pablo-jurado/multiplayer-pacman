import mori from 'mori'
import Tile from './Tile'
import Player from './Player'
import { maze, maze2 } from '../img/maze'

function Board ({ board, players }) {
  const playersData = mori.vals(players)
  const numRows = mori.count(board)

  let rows = []
  for (let i = 0; i < numRows; i++) {
    const squares = mori.get(board, i)
    rows.push(<div key={i} className='row'>{Tile(squares)}</div>)
  }

  let playersArr = []
  mori.each(playersData, (p) => playersArr.push(Player(p, board)))
  return (
    <div className='board-wrapper'>
      <div className='board'>
        {playersArr}
        {rows}
      </div>
      {maze}
      {maze2}
    </div>
  )
}

export default Board
