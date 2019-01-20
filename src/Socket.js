import io from 'socket.io-client'
import mori from 'mori'
import { removeKeyListener } from './components/KeyHandler'
import { resetInitialState, receiveNewPlayer, receiveNewGameState } from './index'

export const socket = io('http://localhost:3100')

// export const socket = io()

function receiveResetLocalState () {
  removeKeyListener()
  resetInitialState()
}

socket.on('newGameState', receiveNewGameState)
socket.on('registerNewPlayer', receiveNewPlayer)
socket.on('resetLocalState', receiveResetLocalState)

export function sendNewColors (state) {
  socket.emit('updateNewColors', JSON.stringify(mori.toJs(state)))
}

export function createNewPlayer (player) {
  socket.emit('newPlayer', JSON.stringify(mori.toJs((player))))
}

export function sendKeyPress (state) {
  socket.emit('keyPress', JSON.stringify(mori.toJs((state))))
}

export function sendRestartGame () {
  socket.emit('restartGame')
}

export function sendEndGame () {
  socket.emit('endGame')
}
