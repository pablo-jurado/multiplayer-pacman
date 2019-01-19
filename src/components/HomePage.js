import { version, linkEvent } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import Countdown from './Countdown'
import { updateName, savetUserName } from '../index'

function handleSubmit (e) {
  e.preventDefault()
  savetUserName()
}

function handleInput (event) {
  const name = event.target.value
  updateName(name);
}

function colorSpan (letter, color) {
  return <span className={color + '-letter'}>{letter}</span>
}

function HomePage (state) {
  let name = mori.get(state, 'name')
  return (
    <div className='home'>
      <p>Welcome to</p>
      <h1>
        {colorSpan('•', 'purple')}
        {colorSpan('•', 'blue')}
        {colorSpan('•', 'green')}
        {colorSpan('m', 'red')}
        {colorSpan('u', 'green')}
        {colorSpan('l', 'purple')}
        {colorSpan('t', 'blue')}
        {colorSpan('i', 'red')}
        {colorSpan('•', 'green')}
        {colorSpan('p', 'purple')}
        {colorSpan('a', 'blue')}
        {colorSpan('c', 'red')}
        {colorSpan('m', 'green')}
        {colorSpan('a', 'purple')}
        {colorSpan('n', 'blue')}
        {colorSpan('•', 'green')}
        {colorSpan('•', 'purple')}
        {colorSpan('•', 'red')}

      </h1>
      <h4>Enter your name</h4>
      <form>
        <input value={name} onInput={handleInput} />
        <button onClick={handleSubmit}>Next</button>
      </form>
      {Countdown(state)}
    </div>
  )
}

export default HomePage
