import io from 'socket.io-client'
import mori from 'mori'
import { log } from './helpers'

export const socket = io('http://localhost:3100')

// export const socket = io()

function receiveNewGameState (state) {
  const newState = JSON.parse(state)
  // window
  window.appState = mori.assoc(window.appState, 'game', mori.toClj(newState.game))
}

socket.on('newGameState', receiveNewGameState)

export function sendNewColors (state) {
  socket.emit('updateNewColors', JSON.stringify(mori.toJs(state)))
}

export function createNewPlayer (player) {
  socket.emit('newPlayer', JSON.stringify(mori.toJs((player))))
}
