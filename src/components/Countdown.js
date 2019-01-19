import mori from 'mori'
import { addZero } from '../helpers'

function Countdown ({ state }) {
  const numberOfPlayers = mori.getIn(state, ['game', 'numberOfPlayers'])
  const countdown = mori.getIn(state, ['game', 'countdown'])
  let time = null

  if (!numberOfPlayers) return null

  // countdown unit is 1-- every 100ms
  if (countdown && countdown !== 150) {
    let strCountdown = countdown.toString()
    let seconds = strCountdown.slice(0, strCountdown.length - 1)
    time = '00:' + addZero(seconds)
  }
  return (
    <div>
      <p>Next game will start in: {time}</p>
      <p>Players online: {numberOfPlayers}</p>
    </div>
  )
}

export default Countdown
