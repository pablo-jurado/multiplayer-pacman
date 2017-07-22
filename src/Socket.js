import io from 'socket.io-client'

export const socket = io(`http://localhost:3100`)

export function registerUser (user) {
  socket.emit('registerUser', user)
}

socket.on('gotAllUsers', function (data) {
  console.log(data)
})
