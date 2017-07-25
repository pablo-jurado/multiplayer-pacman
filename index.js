var express = require('express')
var app = express()
var path = require('path')
var http = require('http').Server(app)
var io = require('socket.io')(http)
var port = process.env.PORT || 3100

// var mori = require('mori')

function uuid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
}

let players = {}

let numOfUsers = 0
app.use(express.static(path.join(__dirname, '/build/')))

io.on('connection', function (socket) {
  console.log('a user connected')

  socket.on('registerUser', function (user) {
    let newUser = JSON.parse(user)
    numOfUsers += 1
    if (numOfUsers < 5) {
      newUser.index = numOfUsers
      players[newUser.id] = newUser
    }
  })

  socket.on('getCurrentUsers', function () {
    socket.emit('gotAllUser', JSON.stringify(players))
  })

  socket.on('createPlayers', function (data) {
    let allPlayers = JSON.parse(data)
    players = allPlayers
    socket.emit('updateAllPlayers', JSON.stringify(players))
  })

  socket.on('updateUser', function (data) {
    let user = JSON.parse(data)
    if (user) {
      players[user.id] = user
    }
  })

  function sendUpdate () {
    socket.emit('serverUpdate', JSON.stringify(players))
  }

  const updateTime = 100
  setInterval(sendUpdate, updateTime)
})

http.listen(port, function () {
  console.log('listening on *:' + port)
})
