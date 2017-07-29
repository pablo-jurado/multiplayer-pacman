import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import { sendNewState } from './Socket'
import { log } from './helpers'

function checkCollision (x, y, direction, board) {
  let value = null
  if (direction === 'right') value = mori.getIn(board, [y, x + 1])
  if (direction === 'left') value = mori.getIn(board, [y, x - 1])
  if (direction === 'bottom') value = mori.getIn(board, [y + 1, x])
  if (direction === 'top') value = mori.getIn(board, [y - 1, x])
  return value
}

function checkTunnel (x, y, dir, board, id) {
  return
  // TODO: need to fix
  const xrow = mori.get(board, 0)
  const xMax = mori.count(xrow) - 1

  if (x === 0 && dir === 'left') window.appState = mori.assocIn(window.appState, ['players', id, 'x'], xMax)
  if (x === (xMax) && dir === 'right') window.appState = mori.assocIn(window.appState, ['players', id, 'x'], 0)
}

function extraPoints (v) {
  return v + 100
}

function weakenAllPlayers (id) {
  let players = mori.vals(mori.get(window.appState, 'players'))
  mori.each(players, function (p) {
    const currentPlayerID = mori.get(p, 'id')
    if (currentPlayerID !== id) {
      window.appState = mori.assocIn(window.appState, ['players', currentPlayerID, 'isWeak'], true)
    }
  })
}

function movePlayer (index, id, direction, x, y, hasPower, board) {
  let newGameState = window.appState
  const yMax = mori.count(board) - 1
  const xRow = mori.get(board, 0)
  const xMax = mori.count(xRow) - 1

  if (direction === 'right' && x < xMax) x += 1
  if (direction === 'left' && x > 0) x -= 1
  if (direction === 'bottom' && y < yMax) y += 1
  if (direction === 'top' && y > 0) y -= 1

  // updates next tile
  newGameState = mori.assocIn(newGameState, ['game', 'board', y, x], 'p' + index)
  // update player x and y
  newGameState = mori.assocIn(newGameState, ['game', 'players', id, 'x'], x)
  newGameState = mori.assocIn(newGameState, ['game', 'players', id, 'y'], y)
  sendNewState(newGameState)
}

function Player (player, board) {
  const id = mori.get(player, 'id')
  const tic = mori.get(player, 'ticCount')
  const color = mori.get(player, 'color')
  const direction = mori.get(player, 'direction')
  const speed = mori.get(player, 'speed')
  let x = mori.get(player, 'x')
  let y = mori.get(player, 'y')
  let classVal = 'player ' + color
  const yMax = mori.count(board)
  const xRow = mori.count(mori.get(board, 0))

  // if (tic === speed) movePlayer(id, direction, x, y, board)

  var xPercent = x * 100 / xRow
  var yPercent = y * 100 / yMax

  let styles = {
    left: xPercent + '%',
    top: yPercent + '%',
    transition: 'all ' + speed + '00ms linear'
  }

  return (
    <div className={classVal} style={styles} />
  )
}

export default Player
