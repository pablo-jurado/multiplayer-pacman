import { version, linkEvent } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import Game from './Game'
import { sendNewColors } from './Socket'
// import { addKeyListener } from './KeyHandler'
// import { createPlayer } from './index'
import { log } from './helpers'
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

function selectColor (event) {
  // let serverState = mori.get(window.appState, 'game')
  const color = event.target.id
  const colors = mori.getIn(window.appState, ['game', 'colors'])
  if (color === 'grey') return
  const newColors = mori.filter(function (c) {
    return c !== color
  }, colors)
  window.appState = mori.assoc(window.appState, 'color', color)
  sendNewColors(newColors)
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
  // const colorSelected = mori.get(state, 'colorSelected')

  let colorsCollection = []

  mori.each(colors, function (color) {
    if (color) colorsCollection.push(<img id={color} src={playerSrc} alt={color} />)
    else colorsCollection.push(<img id='grey' src={playerSrc} alt={color} />)
  })

  return (
    <div className='home'>
      <h2>Welcome {name}</h2>
      <p>Please select your player</p>
      <div className='preview' onClick={selectColor} >
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
