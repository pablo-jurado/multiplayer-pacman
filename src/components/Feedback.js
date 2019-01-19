import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import { sendRestartGame, sendEndGame } from './Socket'

function getWinner (a, b) {
  const scoreA = mori.get(a, 'score')
  const scoreB = mori.get(b, 'score')

  if (scoreA > scoreB) return a
  else return b
}

function Feedback (state) {
  const players = mori.vals(mori.getIn(state, ['game', 'players']))
  const isGameOver = mori.getIn(state, ['game', 'isGameOver'])
  const id = mori.get(state, 'id')
  let buttons = null

  // if user don't have an ID is an expectator
  if (!isGameOver) return null

  if (id) {
    buttons = (
      <div>
        <button onClick={sendRestartGame}>Play Again</button>
        <button onClick={sendEndGame}>End Game</button>
      </div>
    )
  }

  const winner = mori.reduce(getWinner, [], players)
  const score = mori.get(winner, 'score')
  const name = mori.get(winner, 'name')
  return (
    <div className='feedback'>
      <div className='feedback-body'>
        <h2>The winner is {name}, with {score} points.</h2>
        {buttons}
      </div>
    </div>
  )
}

export default Feedback
