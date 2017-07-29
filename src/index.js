import { render } from 'inferno'
import { deepCopy, log } from './helpers'
import { socket } from './Socket'
import App from './App'
import mori from 'mori'

// -----------------------------------------------------------------------------
// App State
// -----------------------------------------------------------------------------

let initialState = {
  page: 'home', // ['home', 'select', 'game'],
  colorSelected: null,
  name: '',
  id: null,
  game: {
    // board: [],
    // players: {},
    // powerTimer: 0,
    // isPowerMode: false,
    // numberOfPlayers: null,
    // colors: [],
    // isGameReady: null
  }
}

window.PLAYER_ID = null

window.appState = mori.toClj(initialState)

// socket.on('updateAllPlayers', function (playersServer) {
//   const players = mori.toClj(JSON.parse(playersServer))
//   window.appState = mori.assocIn(window.appState, ['players'], players)
// })
//
// socket.on('serverUpdate', function (playersServer) {
//   const players = JSON.parse(playersServer)
//
//   for (var key in players) {
//     let id = players[key].id
//     let direction = players[key].direction
//
//     window.appState = mori.assocIn(window.appState, ['players', id, 'direction'], direction)
//   }
//   renderNow(window.appState)
// })

// -----------------------------------------------------------------------------
// Render Loop
// -----------------------------------------------------------------------------

const rootEl = document.getElementById('app')

function renderNow () {
  render(App(window.appState), rootEl)
  window.requestAnimationFrame(renderNow)
}

window.requestAnimationFrame(renderNow)

// -----------------------------------------------------------------------------
// Game Loop
// -----------------------------------------------------------------------------

function updateRenderFrame () {
  const id = window.PLAYER_ID
  if (!id) return

  const count = mori.getIn(window.appState, ['players', id, 'count'])
  const speed = mori.getIn(window.appState, ['players', id, 'speed'])

  if (count === speed) window.appState = mori.assocIn(window.appState, ['players', id, 'count'], 0)
  window.appState = mori.updateIn(window.appState, ['players', id, 'count'], mori.inc)
}

const GAME_TICK_MS = 100
window.setInterval(updateRenderFrame, GAME_TICK_MS)

// function gameTick () {
//
// }
//
// window.setInterval(gameTick, 100)
