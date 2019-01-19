import { version } from 'inferno'
import Component from 'inferno-component'
import { addZero } from '../helpers'

function Timer (time) {
  let strTime = time.toString()
  let seconds = strTime.slice(0, strTime.length - 1)
  time = addZero(seconds)
  return (
    <div className='timer'>
      <p>Time left: {time}</p>
    </div>
  )
}

export default Timer
