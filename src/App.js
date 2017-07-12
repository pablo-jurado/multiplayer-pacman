import { version } from 'inferno'
import Component from 'inferno-component'
import './App.css'

window.addEventListener('keydown', checkArrow)

function checkArrow (event) {
  const keyValue = event.keyCode
  const left = 37
  const up = 38
  const right = 39
  const down = 40

  if (keyValue === left) window.appState.player.direction = 'left'
  if (keyValue === right) window.appState.player.direction = 'right'
  if (keyValue === up) window.appState.player.direction = 'top'
  if (keyValue === down) window.appState.player.direction = 'bottom'
}

function Player (player) {
  let direction = player.direction
  let speed = player.speed
  let x = player.x
  let y = player.y

  if (direction === 'right') x += speed
  if (direction === 'left') x -= speed
  if (direction === 'bottom') y += speed
  if (direction === 'top') y -= speed

  let styles = { left: x + '%', top: y + '%' }

  if (x <= 100 && x >= 0 && y <= 100 && y >= 0) {
    window.appState.player.x = x
    window.appState.player.y = y
  }

  return (
    <div className='player' style={styles} />
  )
}

function Square (square) {
  let classVal = 'square'
  const squares = square.map((item, i) => {
    if (item === 1) classVal = 'square wall'
    if (item === 0) classVal = 'square'
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
      {Player(state.player)}
      {rows}
    </div>
  )
}

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
