import io from 'socket.io-client'
import mori from 'mori'

export const socket = io('http://localhost:3100')

// export const socket = io()

function receiveNewGameState (newState) {
  newState
}

socket.on('newGameState', receiveNewGameState)

socket.on('gotAllUsers', function (data) {
  console.log(data)
})
