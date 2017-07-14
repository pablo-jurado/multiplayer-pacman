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

  for (var i = 0; i < window.appState.players.length; i++) {
    if (keyValue === left) window.appState.players[i].direction = 'left'
    if (keyValue === right) window.appState.players[i].direction = 'right'
    if (keyValue === up) window.appState.players[i].direction = 'top'
    if (keyValue === down) window.appState.players[i].direction = 'bottom'
  }
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

function checkTunnel (x, y, dir) {
  let xMax = window.appState.board[0].length - 1
  if (x === 0 && dir === 'left') window.appState.player.x = xMax
  if (x === (xMax) && dir === 'right') window.appState.player.x = 0
}

function Player (player) {
  const direction = player.direction
  const id = player.id
  const classVal = 'player player' + id
  let x = player.x
  let y = player.y

  let collisionVal = checkCollision(x, y, direction)

  if (collisionVal !== 1) {
    if (direction === 'right' && x < 27) x += 1
    if (direction === 'left' && x > 0) x -= 1
    if (direction === 'bottom' && y < 30) y += 1
    if (direction === 'top' && y > 0) y -= 1

    window.appState.players[id].x = x
    window.appState.players[id].y = y

    if (collisionVal === 2) {
      window.appState.players[id].score += 1
      window.appState.board[y][x] = 0
    }
  }

  var xPercent = x * 100 / 28
  var yPercent = y * 100 / 31

  let styles = {
    left: xPercent + '%',
    top: yPercent + '%'
  }

  // checkTunnel(x, y, direction)
  // if (x <= 0 || x >= 27) styles.display = 'none'

  return (
    <div className={classVal} style={styles} />
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
  const players = state.players
  const rows = board.map((item, i) => {
    return <div key={i} className='row'>{Square(item)}</div>
  })
  const playersArr = players.map((playerState) => {
    return Player(playerState)
  })
  return (
    <div className='board'>
      {playersArr}
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
