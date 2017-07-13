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

function checkNextMove() {

}

function checkCollision (x, y, direction) {
  let board = window.appState.board
  let value = null

  if (direction === 'right') value = board[y][x + 1]
  if (direction === 'left') value = board[y][x - 1]
  if (direction === 'bottom') value = board[y + 1][x]
  if (direction === 'top') value = board[y - 1][x]
  return value
}

function Player (player) {
  let direction = player.direction
  let speed = player.speed
  let x = player.x
  let y = player.y

  let collisionVal = checkCollision(x, y, direction)

  if (collisionVal !== 1) {
    if (collisionVal === 2) console.log('eat dot')
    if (direction === 'right' && x < 27) x += speed
    if (direction === 'left' && x > 0) x -= speed
    if (direction === 'bottom' && y < 30) y += speed
    if (direction === 'top' && y > 0) y -= speed

    window.appState.player.x = x
    window.appState.player.y = y
  }

  var xPercent = x * 100 / 28
  var yPercent = y * 98.3 / 30
  let styles = { left: xPercent + '%', top: yPercent + '%' }

  return (
    <div className='player' style={styles} />
  )
}

function Square (square) {
  let classVal = 'square'
  const squares = square.map((item, i) => {
    if (item === 0) classVal = 'square'
    if (item === 1) classVal = 'square wall'
    if (item === 2) classVal = 'square dot'

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
