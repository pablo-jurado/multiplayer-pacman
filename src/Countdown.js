import { version, linkEvent } from 'inferno'
import Component from 'inferno-component'
import { log } from './helpers'
import mori from 'mori'

function addZero (str) {
  let newString = str
  if (str.length === 1) newString = '0' + str
  if (str.length === 0) newString = '00' + str
  return newString
}

function Countdown (state) {
  const numberOfPlayers = mori.getIn(state, ['game', 'numberOfPlayers'])
  const countdown = mori.getIn(state, ['game', 'countdown'])
  let time = null

  if (!numberOfPlayers) return null

  // countdown unit is 1-- every 100ms
  if (countdown && countdown !== 150) {
    let strCountdown = countdown.toString()
    let seconds = strCountdown.slice(0, strCountdown.length - 1)
    let milliseconds = strCountdown.slice(strCountdown.length - 1, strCountdown.length + 1)
    time = addZero(seconds) + ':' + addZero(milliseconds)
  }
  return (
    <div>
      <h4>Next Game will start in: {time}</h4>
      <h4>Players online: {numberOfPlayers}</h4>
    </div>
  )
}

export default Countdown
