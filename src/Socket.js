import io from 'socket.io-client'

var socket = io(`http://localhost:3100`)

export function setName (name) {
  socket.emit('setName', name)
}

socket.on('gotUser', function (data) {
  console.log(data)
})
