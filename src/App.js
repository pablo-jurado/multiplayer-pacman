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

function uuid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
}

function selectPlayer (event, colorSelected) {
  let color = event.target.id
  if (color === 'grey' || !colorSelected) return
  console.log(color)
  // isColorSelected = true
  // window.PLAYER_ID = uuid()
  // instance.setState({ color: color, id: window.PLAYER_ID })
  // // save user data on server
  // let player = instance.state
  // addKeyListener(player)
  // let userData = JSON.stringify(player)
  // socket.emit('registerUser', userData)
}

function updateName (event) {
  window.appState = mori.assocIn(window.appState, ['name'], event.target.value)
}

function savetUserName (e) {
  e.preventDefault()
  window.appState = mori.assocIn(window.appState, ['page'], 'select')
}

function SelectPlayer (state) {
  const name = mori.get(state, 'name')
  const colors = mori.getIn(state, ['game', 'colors'])
  const colorSelected = mori.get(state, 'colorSelected')

  let colorsCollection = []

  mori.each(colors, function (color) {
    if (color) colorsCollection.push(<img id={color} src={playerSrc} alt={color} />)
    else colorsCollection.push(<img id='grey' src={playerSrc} alt={color} />)
  })

  return (
    <div className='home'>
      <h2>Welcome {name}</h2>
      <p>Please select your player</p>
      <div className='preview' onClick={linkEvent(selectPlayer, colorSelected)} >
        {colorsCollection}
      </div>
    </div>
  )
}

function HomePage (state) {
  let name = mori.get(state, 'name')
  return (
    <div className='home'>
      <h1>Welcome to aMazeBattle</h1>
      <form>
        <input value={name} onInput={updateName} />
        <button onClick={savetUserName}>Next</button>
      </form>
    </div>
  )
}

function App (state) {
  const page = mori.get(state, 'page')
  const isGameReady = mori.get(state, 'isGameReady')

  if (page === 'home') return HomePage(state)
  else if (page === 'select') return SelectPlayer(state)
  else if (isGameReady) return Game(state)
}

export default App
