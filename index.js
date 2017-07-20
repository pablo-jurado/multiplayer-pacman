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

  socket.on('test', function (data) {
    console.log(data)

    socket.emit('testBack', data + ' from the server')
  })
})

http.listen(port, function () {
  console.log('listening on *:' + port)
})
