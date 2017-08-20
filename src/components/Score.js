import { version } from 'inferno'
import Component from 'inferno-component'
import { log } from './helpers'
import mori from 'mori'

function Score (players) {
  const playerVal = mori.vals(players)
  let playersArr = []

  mori.each(playerVal, function (p) {
    const name = mori.get(p, 'name')
    const score = mori.get(p, 'score')
    const color = mori.get(p, 'color')

    if (name !== 'ghost') {
      playersArr.push(
        <div className='score'>
          <div>
            <p>
              <span className={color} >{name}</span>
              <br />
              <span>Score: {score}</span>
            </p>
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
