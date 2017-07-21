import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import Game from './Game'
import { setName } from './Socket'
import './App.css'

export const log = (...args) => {
  console.log(...args.map(mori.toJs))
}

let userName = ''
let selectChareacter = null

function submitUserName (e) {
  e.preventDefault()
  setName(userName)
  selectChareacter = true
}

function updateName (e) {
  userName = e.target.value
}

function Character () {
  return (
    <div className='home'>
      <h2>Welcome {userName}</h2>
      <p>Please select your player</p>
      <div>
        <div>player 1</div>
        <div>player 2</div>
      </div>
      <div>
        <div>player 3</div>
        <div>player 4</div>
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
  const isGameReady = mori.get(state, 'isGameReady')
  // if (isGameReady) page Game(state)
  if (selectChareacter) page = Character()
  return page
}
