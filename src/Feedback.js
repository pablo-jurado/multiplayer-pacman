import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import { log } from './helpers'

function getWinner (a, b) {
  const scoreA = mori.get(a, 'score')
  const scoreB = mori.get(b, 'score')

  if (scoreA > scoreB) return a
  else return b
}

function Feedback (state) {
  const players = mori.vals(mori.getIn(state, ['game', 'players']))
  const isGameOver = mori.getIn(state, ['game', 'isGameOver'])

  if (!isGameOver) return null

  const winner = mori.reduce(getWinner, [], players)
  const score = mori.get(winner, 'score')
  const name = mori.get(winner, 'name')
  return (
    <div className='feedback'>
      <h2>The winner is {name}, with {score} points.</h2>
    </div>
  )
}

export default Feedback
