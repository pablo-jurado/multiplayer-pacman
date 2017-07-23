import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import { log } from './helpers'

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
  const xrow = mori.get(board, 0)
  const xMax = mori.count(xrow) - 1

  if (x === 0 && dir === 'left') window.appState = mori.assocIn(window.appState, ['players', id, 'x'], xMax)
  if (x === (xMax) && dir === 'right') window.appState = mori.assocIn(window.appState, ['players', id, 'x'], 0)
}

function updateRenderFrame (id, count, speed) {
  if (count === speed) window.appState = mori.assocIn(window.appState, ['players', id, 'count'], 0)
  window.appState = mori.updateIn(window.appState, ['players', id, 'count'], mori.inc)
}

function extraPoints (v) {
  return v + 100
}

function weakenAllPlayers (id) {
  let players = mori.get(window.appState, 'players')
  mori.each(players, function (p) {
    const currentPlayerID = mori.get(p, 'id')
    if (currentPlayerID !== id) {
      window.appState = mori.assocIn(window.appState, ['players', currentPlayerID, 'isWeak'], true)
    }
  })
}

function movePlayer (id, direction, x, y, hasPower, board) {
  let collisionVal = checkCollision(x, y, direction)

  if (collisionVal === 'p0' || collisionVal === 'p1' ||
      collisionVal === 'p2' || collisionVal === 'p3') {
    if (hasPower) {
      const num = parseInt(collisionVal.slice(1))
      window.appState = mori.assocIn(window.appState, ['players', num, 'isDead'], true)
    } else {
      return
    }
  }
  // number 1 is a wall
  if (collisionVal !== 1) {
    // reset board value to empty
    window.appState = mori.assocIn(window.appState, ['board', y, x], 0)

    // board limits
    const yMax = mori.count(board) - 1
    const xRow = mori.get(board, 0)
    const xMax = mori.count(xRow) - 1

    if (direction === 'right' && x < xMax) x += 1
    if (direction === 'left' && x > 0) x -= 1
    if (direction === 'bottom' && y < yMax) y += 1
    if (direction === 'top' && y > 0) y -= 1

    // number 3 is a power dot
    if (collisionVal === 3) {
      // if the player eats a power dot gets extra points and eating power
      window.appState = mori.updateIn(window.appState, ['players', id, 'score'], extraPoints)
      window.appState = mori.assocIn(window.appState, ['players', id, 'hasPower'], true)
      // start game power mode
      window.appState = mori.assoc(window.appState, 'isPowerMode', true)
      weakenAllPlayers(id)
    }

    // number 2 is a regular dot
    if (collisionVal === 2) {
      window.appState = mori.updateIn(window.appState, ['players', id, 'score'], mori.inc)
    }

    // updates next tile
    window.appState = mori.assocIn(window.appState, ['board', y, x], 'p' + id)
    // update player x and y
    window.appState = mori.assocIn(window.appState, ['players', id, 'x'], x)
    window.appState = mori.assocIn(window.appState, ['players', id, 'y'], y)
  }
}

function Player (player, board) {
  log(player)
  return
  const id = mori.get(player, 'id')
  const direction = mori.get(player, 'direction')
  const speed = mori.get(player, 'speed')
  const hasPower = mori.get(player, 'hasPower')
  const isWeak = mori.get(player, 'isWeak')
  const isDead = mori.get(player, 'isDead')
  let x = mori.get(player, 'x')
  let y = mori.get(player, 'y')
  let count = mori.get(player, 'count')
  let classVal = 'player player' + id
  const yMax = mori.count(board)
  const xRow = mori.count(mori.get(board, 0))

  if (count === speed) movePlayer(id, direction, x, y, hasPower, board)
  updateRenderFrame(id, count, speed)

  // change player speed depending on is status
  if (isWeak) window.appState = mori.assocIn(window.appState, ['players', id, 'speed'], 4)
  if (hasPower) {
    classVal += ' hasPower'
    window.appState = mori.assocIn(window.appState, ['players', id, 'speed'], 2)
  }
  if (!isWeak && !hasPower) window.appState = mori.assocIn(window.appState, ['players', id, 'speed'], 3)

  if (isWeak) classVal += ' isWeak'
  if (isDead) classVal += ' dead'

  var xPercent = x * 100 / xRow
  var yPercent = y * 100 / yMax

  let styles = {
    left: xPercent + '%',
    top: yPercent + '%',
    transition: 'all ' + speed + '00ms linear'
  }

  checkTunnel(x, y, direction, board, id)
  if (x <= 0 || x >= xRow - 1) styles.display = 'none'

  return (
    <div className={classVal} style={styles} />
  )
}

export default Player
