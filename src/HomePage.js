import { version, linkEvent } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import { log } from './helpers'

function savetUserName (e) {
  e.preventDefault()
  window.appState = mori.assocIn(window.appState, ['page'], 'select')
}

function updateName (event) {
  window.appState = mori.assocIn(window.appState, ['name'], event.target.value)
}

function HomePage (state) {
  let name = mori.get(state, 'name')
  return (
    <div className='home'>
      <h1>Welcome to aMazeBattle</h1>
      <form>
        <input value={name} onInput={updateName} />
        <button onClick={savetUserName}>Next</button>
      </form>
    </div>
  )
}

export default HomePage
