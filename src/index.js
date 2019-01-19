import { render } from 'inferno'
import { deepCopy, uuid } from './helpers'
import { createNewPlayer, sendNewColors } from './components/Socket'
import { addKeyListener } from './components/KeyHandler'
import App from './App'
import mori from 'mori'

// -----------------------------------------------------------------------------
// App State
// -----------------------------------------------------------------------------

let initialState = {
  page: 'home', // ['home', 'select', 'game', 'winner'],
  colorSelected: null,
  name: '',
  id: null,
  game: {
    // players: {},
    // board: boards.board1,
    // powerTimer: 0,
    // isPowerMode: false,
    // numberOfPlayers: 0,
    // countdown: 50, // 150
    // gameTimer: 150, // 1500
    // isGameReady: null,
    // isGameOver: null,
    // colors: ['green', 'red', 'blue', 'purple']
  }
}

export let appState = mori.toClj(initialState)

export function resetInitialState() {
  appState = mori.toClj(deepCopy(initialState))
}

export function updateName(name) {
  appState = mori.assocIn(appState, ['name'], name)
}

export function savetUserName() {
  appState = mori.assocIn(appState, ['page'], 'select')
}

export function updateColors(color, newColors) {
  appState = mori.assoc(appState, 'colorSelected', color)
  sendNewColors(newColors)
}

export function createPlayer (name, colorSelected) {
  const id = uuid()
  createNewPlayer({name: name, color: colorSelected, id: id})
  appState = mori.assoc(appState, 'id', id)
}

export function receiveNewGameState (state) {
  const newState = JSON.parse(state)
  appState = mori.assoc(appState, 'game', mori.toClj(newState.game))
}

export function receiveNewPlayer (state) {
  const players = mori.vals(mori.toClj(JSON.parse(state)))

  mori.each(players, function (p) {
    const id = mori.get(p, 'id')
    const localPlayer = mori.get(appState, 'id')

    if (id === localPlayer) addKeyListener()
  })
}

// -----------------------------------------------------------------------------
// Render Loop
// -----------------------------------------------------------------------------

const rootEl = document.getElementById('app')

function renderNow() {
  render(<App state={appState} />, rootEl)
  window.requestAnimationFrame(renderNow)
}

window.requestAnimationFrame(renderNow)
