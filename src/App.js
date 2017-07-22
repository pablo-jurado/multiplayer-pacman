import { version, linkEvent } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import Game from './Game'
import { socket } from './Socket'
import { addKeyListener } from './KeyHandler'
import { createPlayer } from './index'
import { log } from './helpers'
import io from 'socket.io-client'
import playerSrc from './img/player.png'
import './App.css'

const numberOfPlayers = 2

let isGameReady = null
let isColorSelected = null
let colorsLeft = ['green', 'red', 'blue', 'purple']

function selectPlayer (instance, event) {
  let color = event.target.id
  if (isColorSelected || color === 'grey') return
  isColorSelected = true
  window.mainUserColor = color
  instance.setState({ color: color })
  // save user data on server
  let userData = JSON.stringify(instance.state)
  socket.emit('registerUser', userData)
  // gets users data and unique ID from server
  socket.on('gotUser', function (user) {
    // console.log('got', JSON.parse(user))
    // TODO: need to add key event listener here
  })
}

function updateName (instance, event) {
  instance.setState({ name: event.target.value })
}

function savetUserName (instance, event) {
  event.preventDefault()
  instance.setState({ isNameSet: true })
}

function getAllColors (color) {
  if (color) return <img id={color} src={playerSrc} alt={color} />
  return <img id='grey' src={playerSrc} alt={color} />
}

function startGame (userData) {
  let players = userData.players

  for (var key in players) {
    console.log('id', players[key].id)
    console.log('name', players[key].name)
    console.log('color', players[key].color)
  }

  // TODO: crete users with the new data structure

  // let users = []
  // userData.forEach(function (user) {
  //   users.push(createPlayer(user.id, user.name, user.color))
  //   if (window.mainUserColor === user.color) addKeyListener(user.id)
  // })
  // need to save user on server
  // window.appState = mori.assoc(window.appState, 'players', mori.toClj(users))
  // isGameReady = true
}

class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      isNameSet: false,
      color: null,
      id: null
    }
  }
  render () {
    socket.emit('getCurrentUsers')
    socket.on('gotAllUser', function (users) {
      let userCount = 0
      let userData = JSON.parse(users)
      let players = userData.players
      // if a color is used will erase from colorsLeft
      for (var key in players) {
        let color = players[key].color
        let idx = colorsLeft.indexOf(color)
        colorsLeft[idx] = null
        userCount += 1
      }
      // checks num of players to start the game
      // TODO: need to add timer to start the games anyways
      if (userCount === numberOfPlayers) startGame(userData)
    })
    if (!this.state.isNameSet) {
      return (
        <div className='home'>
          <h1>Welcome to aMazeBattle</h1>
          <form>
            <input value={this.state.name} onInput={linkEvent(this, updateName)} />
            <button onClick={linkEvent(this, savetUserName)}>Start Game</button>
          </form>
        </div>
      )
    } else {
      const allColors = colorsLeft.map(getAllColors)
      return (
        <div className='home'>
          <h2>Welcome {this.state.name}</h2>
          <p>Please select your player</p>
          <div className='preview' onClick={linkEvent(this, selectPlayer)}>
            {allColors}
          </div>
        </div>
      )
    }
  }
}

function App (state) {
  if (isGameReady) return Game(state)
  return <HomePage />
}

export default App
