import Countdown from './Countdown'
import { updateName, savetUserName } from '../index'

const ColorSpan = ({ letter, color }) => <span className={color + '-letter'}>{letter}</span>

export function onHomePageMounted() {
  const textArray = [ '•', '•', '•', 'm', 'u', 'l', 't', 'i', '•', 'p', 'a', 'c', 'm', 'a', 'n', '•', '•', '•']
  const colorsArray = ['purple', 'blue', 'green', 'red']
  let counter = 0

  const textWithColor = textArray.map(letter => {
    counter++
    if(counter === colorsArray.length) counter = 0
    return <ColorSpan letter={letter} color={colorsArray[counter]} />
  })

  welcomeText = textWithColor
}

let welcomeText = null

function handleSubmit (e) {
  e.preventDefault()
  savetUserName()
}

function handleInput (event) {
  const name = event.target.value
  updateName(name);
}

const HomePage = ({ name, numberOfPlayers, countdown }) => (
  <div className='home'>
    <p>Welcome to</p>
    <h1>{ welcomeText }</h1>
    <h4>Enter your name</h4>
    <form>
      <input value={name} onInput={handleInput} />
      <button onClick={handleSubmit}>Next</button>
    </form>
    <Countdown numberOfPlayers={numberOfPlayers} countdown={countdown} />
  </div>
)

export default HomePage
