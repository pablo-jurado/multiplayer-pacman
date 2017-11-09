import { render } from 'inferno'
import { deepCopy } from './helpers'
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
  chatInput: '',
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
    // colors: ['green', 'red', 'blue', 'purple'],
    // chat
  }
}

window.appState = mori.toClj(initialState)

export function resetInitialState () {
  window.appState = mori.toClj(deepCopy(initialState))
}

// -----------------------------------------------------------------------------
// Render Loop
// -----------------------------------------------------------------------------

const rootEl = document.getElementById('app')

function renderNow () {
  render(App(window.appState), rootEl)
  window.requestAnimationFrame(renderNow)
}

window.requestAnimationFrame(renderNow)
