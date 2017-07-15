import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import maze from './img/maze.svg'
import './App.css'

const log = (...args) => {
  console.log(...args.map(mori.toJs))
}

window.addEventListener('keydown', checkArrow)

function changeSpeed () {
  let speed = mori.getIn(window.appState, ['players', 0, 'speed'])
  if (speed === 1) {
    window.appState = mori.assocIn(window.appState, ['players', 0, 'speed'], 4)
  } else {
    window.appState = mori.assocIn(window.appState, ['players', 0, 'speed'], 1)
  }
  window.appState = mori.assocIn(window.appState, ['players', 0, 'count'], 1)
}

function checkArrow (event) {
  const keyValue = event.keyCode
  const left = 37
  const up = 38
  const right = 39
  const down = 40
  if (keyValue === left) window.appState = mori.assocIn(window.appState, ['players', 0, 'direction'], 'left')
  if (keyValue === right) window.appState = mori.assocIn(window.appState, ['players', 0, 'direction'], 'right')
  if (keyValue === up) window.appState = mori.assocIn(window.appState, ['players', 0, 'direction'], 'top')
  if (keyValue === down) window.appState = mori.assocIn(window.appState, ['players', 0, 'direction'], 'bottom')

  // this is just for testing
  if (keyValue === 65) window.appState = mori.assocIn(window.appState, ['players', 1, 'direction'], 'left')
  if (keyValue === 68) window.appState = mori.assocIn(window.appState, ['players', 1, 'direction'], 'right')
  if (keyValue === 87) window.appState = mori.assocIn(window.appState, ['players', 1, 'direction'], 'top')
  if (keyValue === 83) window.appState = mori.assocIn(window.appState, ['players', 1, 'direction'], 'bottom')
}

function checkCollision (x, y, direction) {
  let value = null
  let board = mori.get(window.appState, 'board')

  if (direction === 'right') value = mori.getIn(board, [y, x + 1])
  if (direction === 'left') value = mori.getIn(board, [y, x - 1])
  if (direction === 'bottom') value = mori.getIn(board, [y + 1, x])
  if (direction === 'top') value = mori.getIn(board, [y - 1, x])
  return value
}

function checkTunnel (x, y, dir, board, id) {
  let xMax = 27
  if (x === 0 && dir === 'left') window.appState = mori.assocIn(window.appState, ['players', id, 'x'], xMax)
  if (x === (xMax) && dir === 'right') window.appState = mori.assocIn(window.appState, ['players', id, 'x'], 0)
}

function updateRenderFrame (id, count, speed) {
  if (count === speed) window.appState = mori.assocIn(window.appState, ['players', id, 'count'], 0)
  window.appState = mori.updateIn(window.appState, ['players', id, 'count'], mori.inc)
}

function movePlayer (id, direction, x, y) {
  let collisionVal = checkCollision(x, y, direction)

  if (collisionVal !== 1) {
    if (direction === 'right' && x < 27) x += 1
    if (direction === 'left' && x > 0) x -= 1
    if (direction === 'bottom' && y < 30) y += 1
    if (direction === 'top' && y > 0) y -= 1

    if (collisionVal === 2) {
      window.appState = mori.assocIn(window.appState, ['board', y, x], 0)
      window.appState = mori.updateIn(window.appState, ['players', id, 'score'], mori.inc)
    }
    window.appState = mori.assocIn(window.appState, ['players', id, 'x'], x)
    window.appState = mori.assocIn(window.appState, ['players', id, 'y'], y)
  }
}

function Player (player, board) {
  const id = mori.get(player, 'id')
  const direction = mori.get(player, 'direction')
  const speed = mori.get(player, 'speed')
  let x = mori.get(player, 'x')
  let y = mori.get(player, 'y')
  let count = mori.get(player, 'count')
  const classVal = 'player player' + id

  if (count === speed) movePlayer(id, direction, x, y)
  updateRenderFrame(id, count, speed)

  var xPercent = x * 100 / 28
  var yPercent = y * 100 / 31

  let styles = {
    left: xPercent + '%',
    top: yPercent + '%',
    transition: 'all ' + speed + '00ms linear'
  }

  checkTunnel(x, y, direction, board, id)
  if (x <= 0 || x >= 27) styles.display = 'none'

  return (
    <div className={classVal} style={styles} />
  )
}

function Square (squares) {
  let classVal = 'square'
  const squaresNum = mori.count(squares)
  let squaresArr = []

  for (let i = 0; i < squaresNum; i++) {
    const item = mori.get(squares, i)

    if (item === 0) classVal = 'square'
    if (item === 1) classVal = 'square wall'
    if (item === 2) classVal = 'square dot'

    squaresArr.push(<div key={i} className={classVal} />)
  }
  return squaresArr
}

function Score (players) {
  let playersArr = []
  mori.each(players, function (p) {
    let id = mori.get(p, 'id')
    let score = mori.get(p, 'score')

    playersArr.push(
      <div className='score'>
        <div>Player{id}</div><div>Score: {score}</div>
      </div>
    )
  })

  return (
    <div className='score-board'>
      {playersArr}
    </div>
  )
}

function Board (state) {
  const board = mori.get(state, 'board')
  const numRows = mori.count(board)
  const players = mori.get(state, 'players')
  const numPlayers = mori.count(players)

  let rows = []
  for (let i = 0; i < numRows; i++) {
    const squares = mori.get(board, i)
    rows.push(<div key={i} className='row'>{Square(squares)}</div>)
  }

  let playersArr = []
  for (let i = 0; i < numPlayers; i++) {
    const player = mori.get(players, i)
    playersArr.push(Player(player, board))
  }
  return (
    <div className='board'>
      {playersArr}
      {rows}
    </div>
  )
}

export function App (state) {
  const players = mori.get(state, 'players')
  return (
    <div className='game'>
      <div>
        <h2>Multiplayer Pacman</h2>
        {Score(players)}
        {Board(state)}
        <button onClick={changeSpeed}>toggle Speed</button>
      </div>
      <img className='maze' src={maze} />
      <img className='maze maze2' src={maze} />
    </div>
  )
}
