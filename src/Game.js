import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import { log } from './helpers'
import Board from './Board'
import Score from './Score'
import Feedback from './Feedback'

function addZero (str) {
  let newString = str
  if (str.length === 1) newString = '0' + str
  if (str.length === 0) newString = '00' + str
  return newString
}

function Timer (num) {
  let time = null
  let strTime = num.toString()
  let seconds = strTime.slice(0, strTime.length - 1)
  time = addZero(seconds)
  return (
    <div>
      <p>Time left: {time}</p>
    </div>
  )
}

function Game (state) {
  let gameClass = 'game'
  const players = mori.getIn(state, ['game', 'players'])
  const isPowerMode = mori.getIn(state, ['game', 'isPowerMode'])
  const timer = mori.getIn(state, ['game', 'gameTimer'])

  if (isPowerMode) gameClass = 'game power-mode'

  return (
    <div className={gameClass}>
      <div>
        <h2>Multiplayer Pacman</h2>
        {Score(players)}
        {Board(state)}
        {Timer(timer)}
        {Feedback(state)}
      </div>
    </div>
  )
}

export default Game
