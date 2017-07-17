import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import Tile from './Tile'
import Player from './Player'
import { maze, maze2 } from './maze'
import { log } from './App'

function Board (state) {
  const board = mori.get(state, 'board')
  const numRows = mori.count(board)
  const players = mori.get(state, 'players')
  const numPlayers = mori.count(players)

  let rows = []
  for (let i = 0; i < numRows; i++) {
    const squares = mori.get(board, i)
    rows.push(<div key={i} className='row'>{Tile(squares)}</div>)
  }

  let playersArr = []
  for (let i = 0; i < numPlayers; i++) {
    const player = mori.get(players, i)
    playersArr.push(Player(player, board))
  }
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
