import { version } from 'inferno'
import Component from 'inferno-component'
import { log } from './helpers'
import mori from 'mori'

function Score (players) {
  const playerVal = mori.vals(players)
  let playersArr = []

  mori.each(playerVal, function (p) {
    let name = mori.get(p, 'name')
    let score = mori.get(p, 'score')

    if (name !== 'ghost') {
      playersArr.push(
        <div className='score'>
          <div>
            <p>Player {name}<br />Score: {score}</p>
          </div>
        </div>
      )
    }
  })

  return (
    <div className='score-board'>
      {playersArr}
    </div>
  )
}

export default Score