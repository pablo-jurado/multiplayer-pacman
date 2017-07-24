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
  instance.setState({ color: color })
  // save user data on server
  let userData = JSON.stringify(instance.state)
  socket.emit('registerUser', userData)
  // gets users data and unique ID from server
  socket.on('gotUser', function (user) {
    const player = JSON.parse(user)
    addKeyListener(player)
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

function startGame (players) {
  let statePlayers = {}

  for (var key in players) {
    const newPlayer = createPlayer(players[key].id, players[key].index, players[key].name, players[key].color)
    statePlayers[key] = newPlayer
  }
  socket.emit('createPlayers', JSON.stringify(statePlayers))
  isGameReady = true
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
      let players = JSON.parse(users)
      // let players = userData.players
      // if a color is used will erase from colorsLeft
      for (var key in players) {
        let color = players[key].color
        let idx = colorsLeft.indexOf(color)
        colorsLeft[idx] = null
        userCount += 1
      }
      // checks num of players to start the game
      // TODO: need to add timer to start the games anyways
      if (userCount === numberOfPlayers) startGame(players)
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
