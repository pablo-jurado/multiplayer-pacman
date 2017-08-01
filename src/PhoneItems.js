import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import { log } from './helpers'
import Board from './Board'
import Score from './Score'
import Timer from './Timer'

function PhoneItems (state) {
  const players = mori.getIn(state, ['game', 'players'])
  const timer = mori.getIn(state, ['game', 'gameTimer'])

  return (
    <div className='phone-items'>
      <header>
        <h2>Multiplayer Pacman</h2>
      </header>
      {Score(players)}
      <div>CONTROLLER</div>
      {Timer(timer)}
    </div>
  )
}

export default PhoneItems
