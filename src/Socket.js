import io from 'socket.io-client'
import mori from 'mori'
import { addKeyListener } from './KeyHandler'
import { log } from './helpers'

export const socket = io('http://localhost:3100')

// export const socket = io()

function receiveNewGameState (state) {
  const newState = JSON.parse(state)

  window.appState = mori.assoc(window.appState, 'game', mori.toClj(newState.game))
  // log(mori.getIn(window.appState, ['game', 'board']))
}

function receiveNewPlayer (state) {
  const players = mori.vals(mori.toClj(JSON.parse(state)))

  mori.each(players, function (p) {
    const id = mori.get(p, 'id')
    const localPlayer = mori.get(window.appState, 'id')

    if (id === localPlayer) addKeyListener(id)
  })
}

socket.on('newGameState', receiveNewGameState)
socket.on('registerNewPlayer', receiveNewPlayer)

export function sendNewColors (state) {
  socket.emit('updateNewColors', JSON.stringify(mori.toJs(state)))
}

export function createNewPlayer (player) {
  socket.emit('newPlayer', JSON.stringify(mori.toJs((player))))
}

export function sendNewState (state) {
  socket.emit('newState', JSON.stringify(mori.toJs((state))))
}

export function sendKeyPress (state) {
  socket.emit('keyPress', JSON.stringify(mori.toJs((state))))
}
