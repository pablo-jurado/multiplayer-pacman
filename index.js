var express = require('express')
var app = express()
var path = require('path')
var http = require('http').Server(app)
var io = require('socket.io')(http)
var port = process.env.PORT || 3100

var mori = require('mori')

function uuid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
}

// let initialState = {
//   board: null,
//   players: {},
//   powerTimer: 0,
//   isPowerMode: false
// }

let players = {}

let numOfUsers = 0
app.use(express.static(path.join(__dirname, '/build/')))

io.on('connection', function (socket) {
  console.log('a user connected')

  socket.on('registerUser', function (user) {
    let newUser = JSON.parse(user)
    numOfUsers += 1
    if (numOfUsers < 5) {
      const newUserKey = uuid()
      newUser.index = numOfUsers
      newUser.id = newUserKey
      players[newUserKey] = newUser
      socket.emit('gotUser', JSON.stringify(newUser))
    }
  })

  socket.on('getCurrentUsers', function () {
    socket.emit('gotAllUser', JSON.stringify(players))
  })

  socket.on('sendUserMove', function (data) {
    let user = JSON.parse(data)
    players[user.id] = user
    socket.emit('gotUserMove', JSON.stringify(players))
  })
})

http.listen(port, function () {
  console.log('listening on *:' + port)
})
