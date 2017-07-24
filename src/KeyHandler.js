import mori from 'mori'
import { socket } from './Socket'
import { log } from './helpers'

export function addKeyListener (player) {
  // TODO save user data on local storage to keep game data when closing browser
  const id = player.id
  window.addEventListener('keydown', checkArrow)

  function checkArrow (event) {
    const keyValue = event.keyCode
    const left = 37
    const up = 38
    const right = 39
    const down = 40

    let player = mori.getIn(window.appState, ['players', id])
    let currentState = window.appState
    let newState = null

    if (keyValue === left) newState = mori.assocIn(currentState, ['players', id, 'direction'], 'left')
    if (keyValue === right) newState = mori.assocIn(currentState, ['players', id, 'direction'], 'right')
    if (keyValue === up) newState = mori.assocIn(currentState, ['players', id, 'direction'], 'top')
    if (keyValue === down) newState = mori.assocIn(currentState, ['players', id, 'direction'], 'bottom')

    // TODO: in each move it should fetch data to server
    // change debounced to throttle
    newState = mori.toJs(newState)
    socketDebounceCall(newState.players[id])
  }
}

var socketDebounceCall = debounce(function (player) {
  socket.emit('sendUserMove', JSON.stringify(player))
}, 50)

// socket.on('gotUserMove', function (data) {
//   let state = JSON.parse(data)
//   console.log(state)
// })

function debounce (func, wait, immediate) {
  var timeout
  return function () {
    var context = this, args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
