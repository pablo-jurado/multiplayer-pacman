import io from 'socket.io-client'

// export const socket = io(`http://localhost:3100`)

export const socket = io()

socket.on('gotAllUsers', function (data) {
  console.log(data)
})
