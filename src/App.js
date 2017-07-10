import { version } from 'inferno'
import Component from 'inferno-component'
import './App.css'

function checkArrow (event) {
  const keyValue = event.keyCode
  const left = 37
  const up = 38
  const right = 39
  const down = 40

  if (keyValue === left) window.appState.player.direction = 'left'
  if (keyValue === right) window.appState.player.direction = 'right'
  if (keyValue === up) window.appState.player.direction = 'up'
  if (keyValue === down) window.appState.player.direction = 'down'
}

window.addEventListener('keydown', checkArrow)

function Square (square) {
  let classVal = 'square'
  const squares = square.map((item, i) => {
    if (item === 1) classVal = 'square blue'
    if (item === 0) classVal = 'square'
    if (item === 'p') classVal = 'player'
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

//     <div tabIndex='0' onkeydown={checkArrow} className='game'>

function App (state) {
  return (
    <div className='game'>
      <div>
        <h2>Multiplayer Pacman</h2>
        {Board(state)}
      </div>
    </div>
  )
}

export default App
