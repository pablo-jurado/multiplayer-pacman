import io from 'socket.io-client'

var socket = io(`http://localhost:3100`)

export function testServer () {
  socket.emit('test', 'hello')
}

socket.on('testBack', function (data) {
  console.log(data)
})
