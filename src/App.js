import { version } from 'inferno'
import Component from 'inferno-component'
import './App.css'

window.addEventListener('keydown', checkArrow)

function changeSpeed () {
  window.appState.players[0].count = 1
  window.appState.players[0].speed = 1
}

function checkArrow (event) {
  const keyValue = event.keyCode
  const left = 37
  const up = 38
  const right = 39
  const down = 40
  if (keyValue === left) window.appState.players[0].direction = 'left'
  if (keyValue === right) window.appState.players[0].direction = 'right'
  if (keyValue === up) window.appState.players[0].direction = 'top'
  if (keyValue === down) window.appState.players[0].direction = 'bottom'

  // this is just for testing
  if (keyValue === 65) window.appState.players[1].direction = 'left'
  if (keyValue === 68) window.appState.players[1].direction = 'right'
  if (keyValue === 87) window.appState.players[1].direction = 'top'
  if (keyValue === 83) window.appState.players[1].direction = 'bottom'
}

function checkCollision (x, y, direction) {
  let value = null
  let board = window.appState.board
  if (direction === 'right') value = board[y][x + 1]
  if (direction === 'left') value = board[y][x - 1]
  if (direction === 'bottom') value = board[y + 1][x]
  if (direction === 'top') value = board[y - 1][x]
  return value
}

function checkTunnel (x, y, dir, board) {
  let xMax = board[0].length - 1
  if (x === 0 && dir === 'left') window.appState.player.x = xMax
  if (x === (xMax) && dir === 'right') window.appState.player.x = 0
}

function updateRenderFrame (id, count, speed) {
  if (count === speed) window.appState.players[id].count = 0
  window.appState.players[id].count += 1
}

function movePlayer (id, direction, x, y) {
  let collisionVal = checkCollision(x, y, direction)

  if (collisionVal !== 1) {
    if (direction === 'right' && x < 27) x += 1
    if (direction === 'left' && x > 0) x -= 1
    if (direction === 'bottom' && y < 30) y += 1
    if (direction === 'top' && y > 0) y -= 1

    window.appState.players[id].x = x
    window.appState.players[id].y = y
  }
}

function Player (player, board) {
  const id = player.id
  const direction = player.direction
  const classVal = 'player player' + id
  const speed = player.speed
  let x = player.x
  let y = player.y
  let count = player.count

  if (count === speed) movePlayer(id, direction, x, y)
  updateRenderFrame(id, count, speed)

  var xPercent = x * 100 / 28
  var yPercent = y * 100 / 31

  let styles = {
    left: xPercent + '%',
    top: yPercent + '%',
    transition: 'all ' + speed + '00ms linear'
  }

  // checkTunnel(x, y, direction, board)
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
    return Player(playerState, board)
  })
  return (
    <div className='board'>
      {playersArr}
      {rows}
    </div>
  )
}

export function App (state) {
  return (
    <div className='game'>
      <div>
        <h2>Multiplayer Pacman</h2>
        {Board(state)}
        <button onClick={changeSpeed}>toggle Speed</button>
      </div>
    </div>
  )
}
