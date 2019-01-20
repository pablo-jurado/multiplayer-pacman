import mori from 'mori'
import { sendRestartGame, sendEndGame } from '../Socket'

function getWinner (a, b) {
  const scoreA = mori.get(a, 'score')
  const scoreB = mori.get(b, 'score')

  if (scoreA > scoreB) return a
  else return b
}

function Feedback ({ players, id }) {
  // vals transforms a hash map to an array so it can be reduced
  const playersArr = mori.vals(players)
  const winner = mori.reduce(getWinner, [], playersArr)
  const score = mori.get(winner, 'score')
  const name = mori.get(winner, 'name')

  const buttons = (
    <div>
      <button onClick={sendRestartGame}>Play Again</button>
      <button onClick={sendEndGame}>End Game</button>
    </div>
  )

  return (
    <div className='feedback'>
      <div className='feedback-body'>
        <h2>The winner is {name}, with {score} points.</h2>
        {id && buttons}
      </div>
    </div>
  )
}

export default Feedback
