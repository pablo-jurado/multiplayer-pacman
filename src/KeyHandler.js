import mori from 'mori'

// TODO save user data on local storage to keep game data when closing browser
window.mainUserColor = null

export function addKeyListener (id) {
  window.addEventListener('keydown', checkArrow)
  function checkArrow (event) {
    const keyValue = event.keyCode
    const left = 37
    const up = 38
    const right = 39
    const down = 40

    // TODO in each move it should fetch data to server
    if (keyValue === left) window.appState = mori.assocIn(window.appState, ['players', id, 'direction'], 'left')
    if (keyValue === right) window.appState = mori.assocIn(window.appState, ['players', id, 'direction'], 'right')
    if (keyValue === up) window.appState = mori.assocIn(window.appState, ['players', id, 'direction'], 'top')
    if (keyValue === down) window.appState = mori.assocIn(window.appState, ['players', id, 'direction'], 'bottom')
  }
}
