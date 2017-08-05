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
    <div className='controller'>
      <div>
        <button onClick={handleController} id='top' />
        <button onClick={handleController} id='right' />
      </div>
      <div>
        <button onClick={handleController} id='left' />
        <button onClick={handleController} id='bottom' />
      </div>
    </div>
  )
}

export default Controller
