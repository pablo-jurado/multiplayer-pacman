import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import { log } from './helpers'
import Board from './Board'
import Score from './Score'

function resetAllPlayers () {
  let players = mori.vals(mori.get(window.appState, 'players'))
  mori.each(players, function (p) {
    const id = mori.get(p, 'id')
    window.appState = mori.assocIn(window.appState, ['players', id, 'isWeak'], false)
    window.appState = mori.assocIn(window.appState, ['players', id, 'hasPower'], false)
  })
}

function updatePowerTimer (powerTimer, isPowerMode) {
  if (isPowerMode) {
    if (powerTimer === 50) {
      // when timer is done, reset all values
      window.appState = mori.assoc(window.appState, 'powerTimer', 0)
      window.appState = mori.assoc(window.appState, 'isPowerMode', false)
      resetAllPlayers()
    }
    // increments timer by 1 every 100ms
    window.appState = mori.updateIn(window.appState, ['powerTimer'], mori.inc)
  }
}

function Game (state) {
  // TODO: add timer to finish game
  let gameClass = 'game'
  const players = mori.get(state, 'players')
  const powerTimer = mori.get(state, 'powerTimer')
  const isPowerMode = mori.get(state, 'isPowerMode')
  updatePowerTimer(powerTimer, isPowerMode)

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
