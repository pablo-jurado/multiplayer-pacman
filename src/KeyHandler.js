import mori from 'mori'
import { socket } from './Socket'
import { log } from './helpers'

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

    let player = mori.getIn(window.appState, ['players', id])

    if (keyValue === left) window.appState = mori.assocIn(window.appState, ['players', id, 'direction'], 'left')
    if (keyValue === right) window.appState = mori.assocIn(window.appState, ['players', id, 'direction'], 'right')
    if (keyValue === up) window.appState = mori.assocIn(window.appState, ['players', id, 'direction'], 'top')
    if (keyValue === down) window.appState = mori.assocIn(window.appState, ['players', id, 'direction'], 'bottom')

    // TODO: in each move it should fetch data to server
    // the event gets fired to many times so needs to be debounced
    socketDebounceCall(player)
  }
}

var socketDebounceCall = debounce(function (player) {
  socket.emit('sendUserMove', 'test')
  log(player)
}, 50)

socket.on('gotUserMove', function (data) {
  console.log('got ' + data + ' from server')
})

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
