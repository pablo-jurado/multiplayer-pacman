import mori from 'mori'
import Board from './Board'
import Score from './Score'
import Timer from './Timer'
import Feedback from './Feedback'
import PhoneItems from './PhoneItems'

function Game ({ state }) {
  const players = mori.getIn(state, ['game', 'players'])
  const isPowerMode = mori.getIn(state, ['game', 'isPowerMode'])
  const timer = mori.getIn(state, ['game', 'gameTimer'])
  const id = mori.get(state, 'id')
  const board = mori.getIn(state, ['game', 'board'])
  const isGameOver = mori.getIn(state, ['game', 'isGameOver'])

  let gameClass = 'game'
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
            <Board board={board} players={players} />
            <Timer timer={timer} />
          </div>
        </div>
        <PhoneItems players={players} timer={timer} id={id} />
        {isGameOver && <Feedback players={players} id={id} />}
      </div>
    </div>
  )
}

export default Game
