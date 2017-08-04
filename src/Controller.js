import { version } from 'inferno'
import Component from 'inferno-component'
import { log } from './helpers'
import mori from 'mori'
import { sendKeyPress } from './Socket'

function handleController (event) {
  const id = mori.get(window.appState, 'id')
  const direction = event.target.id
  if (id) {
    if (direction) sendKeyPress({id: id, direction: direction})
  }
}

function Controller () {
  return (
    <div className='controller' onClick={handleController} >
      <div className='circle' />
      <div>
        <button id='up' />
        <button id='right' />
      </div>
      <div>
        <button id='left' />
        <button id='bottom' />
      </div>
    </div>
  )
}

export default Controller
