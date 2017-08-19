import { version } from 'inferno'
import Component from 'inferno-component'
import { log } from './helpers'
import mori from 'mori'

function addZero (str) {
  let newString = str
  if (str.length === 1) newString = '0' + str
  if (str.length === 0) newString = '00' + str
  return newString
}

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
