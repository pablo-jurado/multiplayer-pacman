var express = require('express')
var app = express()
var path = require('path')
var http = require('http').Server(app)
var io = require('socket.io')(http)
var port = process.env.PORT || 3100

var users = []

app.use(express.static(path.join(__dirname, '/build/')))

io.on('connection', function (socket) {
  console.log('a user connected')

  socket.on('setName', function (name) {
    users.push(name)

    socket.emit('gotUser', 'got user ' + users + ' on the server')
  })
})

http.listen(port, function () {
  console.log('listening on *:' + port)
})
