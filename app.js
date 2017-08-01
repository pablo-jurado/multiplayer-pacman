var express = require('express')
var app = express()
var path = require('path')
var http = require('http').Server(app)
var io = require('socket.io')(http)
var port = process.env.PORT || 3100

const mori = require('mori')
const boards = require('./boards')

app.use(express.static(path.join(__dirname, '/build/')))

// const COUNTDOWN = 150
// const GAME_TIMER = 1500

// fast speed for testing
const COUNTDOWN = 50
const GAME_TIMER = 50

const log = (...args) => {
  console.log(...args.map(mori.toJs))
}

function deepCopy (thing) {
  return JSON.parse(JSON.stringify(thing))
}

const initialState = {
  game: {
    players: {},
    numberOfPlayers: 0,
    colors: ['green', 'red', 'blue', 'purple'],
    board: deepCopy(boards.board1),
    countdown: deepCopy(COUNTDOWN),
    gameTimer: deepCopy(GAME_TIMER),
    powerTimer: 0,
    isPowerMode: false,
    isGameReady: null,
    isGameOver: null
  }
}

let gameState = mori.toClj(deepCopy(initialState))

function createPlayer (name, color, id, index) {
  let direction, x, y = null

  if (index === 0) {
    direction = 'right'
    x = 2
    y = 1
  }
  if (index === 1) {
    direction = 'left'
    x = 26
    y = 1
  }
  if (index === 2) {
    direction = 'right'
    x = 1
    y = 29
  }
  if (index === 3) {
    direction = 'left'
    x = 26
    y = 29
  }

  return {
    direction,
    x,
    y,
    id,
    index,
    name,
    color,
    speed: 3,
    score: 0,
    isWeak: false,
    hasPower: false,
    isDead: false,
    tic: 0
  }
}

function checkIsGameReady () {
  const numberOfPlayers = mori.getIn(gameState, ['game', 'numberOfPlayers'])
  const countdown = mori.getIn(gameState, ['game', 'countdown'])
  let newState = gameState

  if (numberOfPlayers !== 0) {
    newState = mori.updateIn(newState, ['game', 'countdown'], mori.dec)
  }
  if (countdown === 0) {
    newState = mori.assocIn(newState, ['game', 'isGameReady'], true)
  }
  gameState = newState
}

function checkCollision (x, y, direction, board) {
  let value = null

  if (direction === 'right') value = mori.getIn(board, [y, x + 1])
  if (direction === 'left') value = mori.getIn(board, [y, x - 1])
  if (direction === 'bottom') value = mori.getIn(board, [y + 1, x])
  if (direction === 'top') value = mori.getIn(board, [y - 1, x])
  return value
}

function extraPoints (v) {
  return v + 100
}

function checkTunnel (x, y, dir, board, id) {
  const xrow = mori.get(board, 0)
  const xMax = mori.count(xrow) - 1

  if (x === 0 && dir === 'left') gameState = mori.assocIn(gameState, ['game', 'players', id, 'x'], xMax)
  if (x === (xMax) && dir === 'right') gameState = mori.assocIn(gameState, ['game', 'players', id, 'x'], 0)
}

function movePlayer (color, id, direction, x, y, board) {
  let newGameState = gameState
  // board limits
  const yMax = mori.count(board) - 1
  const xRow = mori.get(board, 0)
  const xMax = mori.count(xRow) - 1

  const collisionVal = checkCollision(x, y, direction, board)

  if (collisionVal === 'red' || collisionVal === 'green' ||
      collisionVal === 'blue' || collisionVal === 'purple') {
    const hasPower = mori.getIn(gameState, ['game', 'players', id, 'hasPower'])
    if (hasPower) {
      const players = mori.vals(mori.getIn(gameState, ['game', 'players']))
      mori.each(players, function (p) {
        const otherId = mori.get(p, 'id')
        const color = mori.get(p, 'color')
        if (color === collisionVal) {
          // TODO: needs to erase from board and maybe put on the ghost house
          gameState = mori.assocIn(gameState, ['game', 'players', otherId, 'isDead'], true)
        }
      })
    }
    return
  }
  // if the value is not a wall
  if (collisionVal !== 1) {
    // reset previous board value to empty
    newGameState = mori.assocIn(newGameState, ['game', 'board', y, x], 0)

    // increase x and y value
    if (direction === 'right' && x < xMax) x += 1
    if (direction === 'left' && x > 0) x -= 1
    if (direction === 'bottom' && y < yMax) y += 1
    if (direction === 'top' && y > 0) y -= 1

    // number 2 is a regular dot
    if (collisionVal === 2) {
      newGameState = mori.updateIn(newGameState, ['game', 'players', id, 'score'], mori.inc)
    }

    // number 3 is a power dot
    if (collisionVal === 3) {
      // if the player eats a power dot gets extra points and eating power
      newGameState = mori.updateIn(newGameState, ['game', 'players', id, 'score'], extraPoints)
      newGameState = mori.assocIn(newGameState, ['game', 'players', id, 'hasPower'], true)
      // newGameState = mori.assocIn(newGameState, ['game', 'players', id, 'speed'], 2)
      // start game power mode
      newGameState = mori.assocIn(newGameState, ['game', 'isPowerMode'], true)
    }

    // updates next tile
    newGameState = mori.assocIn(newGameState, ['game', 'board', y, x], color)
    // update player x and y
    newGameState = mori.assocIn(newGameState, ['game', 'players', id, 'x'], x)
    newGameState = mori.assocIn(newGameState, ['game', 'players', id, 'y'], y)

    gameState = newGameState

    checkTunnel(x, y, direction, board, id)
  }
}

function updatePlayersSpeed () {
  const players = mori.vals(mori.getIn(gameState, ['game', 'players']))
  mori.each(players, function (p) {
    const id = mori.get(p, 'id')
    const speed = mori.get(p, 'speed')
    const tic = mori.get(p, 'tic')
    const hasPower = mori.get(p, 'hasPower')
    const isWeak = mori.get(p, 'isWeak')

    if (speed === tic) gameState = mori.assocIn(gameState, ['game', 'players', id, 'tic'], 0)
    gameState = mori.updateIn(gameState, ['game', 'players', id, 'tic'], mori.inc)

    if (hasPower) gameState = mori.assocIn(gameState, ['game', 'players', id, 'speed'], 2)
    if (isWeak) gameState = mori.assocIn(gameState, ['game', 'players', id, 'speed'], 4)
    if (!isWeak && !hasPower) gameState = mori.assocIn(gameState, ['game', 'players', id, 'speed'], 3)
  })
}

function updatePlayersPosition () {
  const players = mori.vals(mori.getIn(gameState, ['game', 'players']))
  const board = mori.getIn(gameState, ['game', 'board'])

  mori.each(players, function (p) {
    const id = mori.get(p, 'id')
    const color = mori.get(p, 'color')
    const speed = mori.get(p, 'speed')
    const direction = mori.get(p, 'direction')
    const x = mori.get(p, 'x')
    const y = mori.get(p, 'y')
    const tic = mori.get(p, 'tic')

    if (tic === speed) {
      movePlayer(color, id, direction, x, y, board)
    }
  })
}

function updateGameTimer () {
  const time = mori.getIn(gameState, ['game', 'gameTimer'])
  let newState = gameState

  if (time === 0) {
    newState = mori.assocIn(newState, ['game', 'isGameOver'], true)
  } else {
    newState = mori.updateIn(newState, ['game', 'gameTimer'], mori.dec)
  }
  gameState = newState
}

function updatePowerTimer () {
  const isPowerMode = mori.getIn(gameState, ['game', 'isPowerMode'])
  const powerTimer = mori.getIn(gameState, ['game', 'powerTimer'])

  if (isPowerMode) {
    gameState = mori.updateIn(gameState, ['game', 'powerTimer'], mori.inc)
    const players = mori.vals(mori.getIn(gameState, ['game', 'players']))
    mori.each(players, function (p) {
      const id = mori.get(p, 'id')
      const hasPower = mori.get(p, 'hasPower')
      // is power mode in on will make weak rest of players
      if (!hasPower) gameState = mori.assocIn(gameState, ['game', 'players', id, 'isWeak'], true)
    })
  }

  if (powerTimer === 50) {
    const players = mori.vals(mori.getIn(gameState, ['game', 'players']))
    mori.each(players, function (p) {
      const id = mori.get(p, 'id')
      gameState = mori.assocIn(gameState, ['game', 'players', id, 'isWeak'], false)
      gameState = mori.assocIn(gameState, ['game', 'players', id, 'hasPower'], false)
    })
    gameState = mori.assocIn(gameState, ['game', 'isPowerMode'], false)
  }
}

function receiveNewPlayer (player) {
  let newState = gameState
  const playerData = JSON.parse(player)
  const index = mori.getIn(gameState, ['game', 'numberOfPlayers'])
  const newPlayer = createPlayer(playerData.name, playerData.color, playerData.id, index)

  newState = mori.assocIn(newState, ['game', 'players', playerData.id], mori.toClj(newPlayer))
  newState = mori.updateIn(newState, ['game', 'numberOfPlayers'], mori.inc)
  gameState = newState

  io.sockets.emit('registerNewPlayer', JSON.stringify(mori.toJs(mori.getIn(gameState, ['game', 'players']))))
}

function receivedKeyPress (state) {
  const user = JSON.parse(state)
  const id = user.id
  const direction = user.direction
  gameState = mori.assocIn(gameState, ['game', 'players', id, 'direction'], direction)
}

function receivedNewColors (state) {
  const colors = mori.toClj(JSON.parse(state))
  gameState = mori.assocIn(gameState, ['game', 'colors'], colors)
}

function receivedRestartGame () {
  // TODO: need to restart Game
}

function onConnection (socket) {
  console.log('A user connected!')

  // socket.on('newState', receiveNewState)
  socket.on('newPlayer', receiveNewPlayer)
  socket.on('keyPress', receivedKeyPress)
  socket.on('updateNewColors', receivedNewColors)
  socket.on('restartGame', receivedRestartGame)
}

io.on('connection', onConnection)

// -----------------------------------------------------------------------------
// Game Loop
// -----------------------------------------------------------------------------

function gameTick () {
  const isGameReady = mori.getIn(gameState, ['game', 'isGameReady'])
  const isGameOver = mori.getIn(gameState, ['game', 'isGameOver'])

  checkIsGameReady()
  if (isGameOver) return
  if (isGameReady) {
    updatePlayersSpeed()
    updatePlayersPosition()
    updatePowerTimer()
    updateGameTimer()
  }

  // send the current game state to all clients
  io.sockets.emit('newGameState', JSON.stringify(mori.toJs(gameState)))
}

const GAME_TICK_MS = 100
setInterval(gameTick, GAME_TICK_MS)

// -----------------------------------------------------------------------------
// Express Server
// -----------------------------------------------------------------------------

http.listen(port, function () {
  console.log('listening on *:' + port)
})
