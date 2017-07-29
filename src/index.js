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

window.appState = mori.toClj(initialState)

// -----------------------------------------------------------------------------
// Render Loop
// -----------------------------------------------------------------------------

const rootEl = document.getElementById('app')

function renderNow () {
  render(App(window.appState), rootEl)
  window.requestAnimationFrame(renderNow)
}

window.requestAnimationFrame(renderNow)
