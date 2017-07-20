import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import Game from './Game'
import './App.css'

export const log = (...args) => {
  console.log(...args.map(mori.toJs))
}

function setUserName () {

}

function homePage () {
  return (
    <div className='home'>
      <h1>Welcome to aMazeBattle</h1>
      <form>
        <input placeholder='Input your Name' />
        <button onClick={setUserName}>Start Game</button>
      </form>
    </div>
  )
}

export function App (state) {
  const isGameReady = mori.get(state, 'isGameReady')
  console.log(isGameReady)
  // if (isGameReady) return Game(state)
  return homePage()
}
