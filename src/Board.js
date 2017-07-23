import mori from 'mori'
import Tile from './Tile'
import Player from './Player'
import { maze, maze2 } from './img/maze'

function Board (state) {
  const board = mori.get(state, 'board')
  const numRows = mori.count(board)
  const players = mori.vals(mori.get(state, 'players'))

  let rows = []
  for (let i = 0; i < numRows; i++) {
    const squares = mori.get(board, i)
    rows.push(<div key={i} className='row'>{Tile(squares)}</div>)
  }

  let playersArr = []
  mori.each(players, function (p) {
    playersArr.push(Player(p, board))
  })
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
