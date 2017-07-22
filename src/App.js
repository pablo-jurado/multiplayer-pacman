import { version, linkEvent } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import Game from './Game'
import { registerUser, socket } from './Socket'
import { addKeyListener } from './KeyHandler'
import { createPlayer } from './index'
import io from 'socket.io-client'
import playerSrc from './img/player.png'
import './App.css'

export const log = (...args) => {
  console.log(...args.map(mori.toJs))
}

let isGameReady = null
let isColorSelected = null
let colorsTaken = []

function selectPlayer (instance, event) {
  let color = event.target.id
  if (isColorSelected || color === 'grey') return
  isColorSelected = true
  console.log('local user color', color)
  window.mainUserColor = color
  instance.setState({ color: color })
  let userData = JSON.stringify(instance.state)
  registerUser(userData)
}

function updateName (instance, event) {
  instance.setState({ name: event.target.value })
}

function savetUserName (instance, event) {
  event.preventDefault()
  instance.setState({ isNameSet: true })
}

function getAllColors (color) {
  if (colorsTaken.indexOf(color) !== -1) return <img id='grey' src={playerSrc} alt={color} />
  return <img id={color} src={playerSrc} alt={color} />
}

function startGame (userData) {
  let users = []
  userData.forEach(function (user) {
    users.push(createPlayer(user.id, user.name, user.color))
    if (window.mainUserColor === user.color) addKeyListener(user.id)
  })
  // need to save user on server
  window.appState = mori.assoc(window.appState, 'players', mori.toClj(users))
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
    socket.on('gotUser', function (users) {
      let userData = JSON.parse(users)
      userData.forEach(function (user) {
        colorsTaken.push(user.color)
      })
      // checks if there is 4 players to start the game
      // TODO: need to add timer to start the games anyways
      if (userData.length === 1) startGame(userData)
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
      const colors = ['green', 'red', 'blue', 'purple']
      const allColors = colors.map(getAllColors)
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

export function App (state) {
  if (isGameReady) return Game(state)
  return <HomePage />
}
