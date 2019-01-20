import mori from 'mori'
import Board from './Board'
import Score from './Score'
import Timer from './Timer'
import Feedback from './Feedback'
import PhoneItems from './PhoneItems'

function Game ({ state }) {
  let gameClass = 'game'
  const players = mori.getIn(state, ['game', 'players'])
  const isPowerMode = mori.getIn(state, ['game', 'isPowerMode'])
  const timer = mori.getIn(state, ['game', 'gameTimer'])

  if (isPowerMode) gameClass = 'game power-mode'

  return (
    <div className='main-wrapper'>
      <div className='game-wrapper'>
        <div className={gameClass}>
          <div>
            <header>
              <h2>Multiplayer Pacman</h2>
            </header>
            <Score players={players} />
            <Board state={state} />
            <Timer timer={timer} />
          </div>
        </div>
        <PhoneItems state={state} />
        <Feedback state={state} />
      </div>
    </div>
  )
}

export default Game
