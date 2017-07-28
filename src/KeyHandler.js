/* global localStorage */
import mori from 'mori'
import { socket } from './Socket'
import { log } from './helpers'

function savePlayer (player) {
  if (typeof (localStorage.player) !== 'undefined') {
    localStorage.removeItem('player')
    localStorage.player = JSON.stringify(player)
  }
}

function getSavedPlayer () {
  if (typeof (localStorage.player) !== 'undefined') {
    addKeyListener(JSON.parse(localStorage.player))
  }
}

// getSavedPlayer()

export function addKeyListener (player) {
  return
  // savePlayer(player)
  const id = player.id
  window.addEventListener('keydown', checkArrow)

  function checkArrow (event) {
    const keyValue = event.keyCode
    const left = 37
    const up = 38
    const right = 39
    const down = 40

    // let player = mori.getIn(window.appState, ['players', id])
    let currentState = window.appState
    let newState = window.appState

    if (keyValue === left) newState = mori.assocIn(currentState, ['players', id, 'direction'], 'left')
    if (keyValue === right) newState = mori.assocIn(currentState, ['players', id, 'direction'], 'right')
    if (keyValue === up) newState = mori.assocIn(currentState, ['players', id, 'direction'], 'top')
    if (keyValue === down) newState = mori.assocIn(currentState, ['players', id, 'direction'], 'bottom')

    // TODO: change debounced to throttle
    newState = mori.toJs(newState)
    socketDebounceCall(newState.players[id])
  }
}

var socketDebounceCall = debounce(function (player) {
  socket.emit('updateUser', JSON.stringify(player))
}, 50)

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
