import { version } from 'inferno'
import Component from 'inferno-component'
import './App.css'

function move (direction) {
  console.log('move ' + direction)
}

function checkArrow (event) {
  const keyValue = event.keyCode
  const left = 37
  const up = 38
  const right = 39
  const down = 40

  if (keyValue === left) move('left')
  if (keyValue === right) move('right')
  if (keyValue === up) move('up')
  if (keyValue === down) move('down')
}

function Player (state) {

  let direction = state.direction
  let num = state.x
  let styles = {}
  styles[direction] = num + 'px'
  return (
    <div className='player' style={styles} />
  )
}

function Square (square) {
  let classVal = 'square'
  const squares = square.map((item, i) => {
    if (!item) classVal = 'square blue'
    if (item) classVal = 'square'
    return <div key={i} className={classVal} />
  })
  return squares
}

function Board (state) {
  const board = state.board
  const rows = board.map((item, i) => {
    return <div key={i} className='row'>{Square(item)}</div>
  })
  return (
    <div className='board'>
      {rows}
    </div>
  )
}

function App (state) {
  return (
    <div tabIndex='0' onkeydown={checkArrow} className='game'>
      <div>
        <h2>Multiplayer Pacman</h2>
        {Board(state)}
      </div>
    </div>
  )
}

export default App
