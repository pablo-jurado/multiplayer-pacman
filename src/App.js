import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import Game from './Game'
import { setName } from './Socket'
import playerSrc from './img/player.png'
import './App.css'

export const log = (...args) => {
  console.log(...args.map(mori.toJs))
}

let userName = ''
let selectChareacter = null
let isPlayerReady = null

function submitUserName (e) {
  e.preventDefault()
  setName(userName)
  selectChareacter = true
}

function updateName (e) {
  userName = e.target.value
}

function selectPlayer (e) {
  console.log(e.target.id)
  selectChareacter = false
  isPlayerReady = true
}

function Character () {
  return (
    <div className='home'>
      <h2>Welcome {userName}</h2>
      <p>Please select your player</p>
      <div className='preview' onClick={selectPlayer}>
        <img id='player1' src={playerSrc} alt='player' />
        <img id='player2' src={playerSrc} alt='player' />
        <img id='player3' src={playerSrc} alt='player' />
        <img id='player4' src={playerSrc} alt='player' />
      </div>
    </div>
  )
}

function homePage (name) {
  return (
    <div className='home'>
      <h1>Welcome to aMazeBattle</h1>
      <form>
        <input onInput={updateName} />
        <button onClick={submitUserName}>Start Game</button>
      </form>
    </div>
  )
}

export function App (state) {
  let page = homePage(userName)
  if (selectChareacter) page = Character()
  if (isPlayerReady) page = Game(state)

  return page
}
