var express = require('express')
var app = express()
var path = require('path')
var http = require('http').Server(app)
var io = require('socket.io')(http)
var port = process.env.PORT || 3100

var newUsersArr = []
app.use(express.static(path.join(__dirname, '/build/')))

io.on('connection', function (socket) {
  console.log('a user connected')

  socket.on('registerUser', function (user) {
    let newUser = JSON.parse(user)
    let numOfUsers = newUsersArr.length
    if (numOfUsers < 4) {
      newUser.id = numOfUsers
      newUsersArr.push(newUser)
      socket.emit('gotUser', JSON.stringify(newUsersArr))
    }
  })

  socket.on('getCurrentUsers', function () {
    socket.emit('gotUser', JSON.stringify(newUsersArr))
  })
})

http.listen(port, function () {
  console.log('listening on *:' + port)
})
