import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import { log } from './helpers'
import Board from './Board'
import Score from './Score'

function Game (state) {
  // TODO: add timer to finish game
  let gameClass = 'game'
  const players = mori.getIn(state, ['game', 'players'])
  const isPowerMode = mori.getIn(state, ['game', 'isPowerMode'])
  // updatePowerTimer(powerTimer, isPowerMode)

  if (isPowerMode) gameClass = 'game power-mode'

  return (
    <div className={gameClass}>
      <div>
        <h2>Multiplayer Pacman</h2>
        {Score(players)}
        {Board(state)}
      </div>
    </div>
  )
}

export default Game
