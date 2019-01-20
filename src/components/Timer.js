import { addZero } from '../helpers'

function Timer ({ timer }) {
  let strTime = timer.toString()
  let seconds = strTime.slice(0, strTime.length - 1)
  return (
    <div className='timer'>
      <p>Time left: {addZero(seconds)}</p>
    </div>
  )
}

export default Timer
