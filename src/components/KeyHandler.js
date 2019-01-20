import mori from 'mori'
import { sendKeyPress } from '../Socket'
import { appState } from '../index'

export function addKeyListener () {
  window.addEventListener('keydown', checkArrow)
}

export function removeKeyListener () {
  window.removeEventListener('keydown', checkArrow)
}

function checkArrow (event) {
  const id = mori.get(appState, 'id')
  let direction = null
  const keyValue = event.keyCode
  const left = 37
  const up = 38
  const right = 39
  const down = 40

  if (keyValue === left) direction = 'left'
  if (keyValue === right) direction = 'right'
  if (keyValue === up) direction = 'top'
  if (keyValue === down) direction = 'bottom'

  if (id) {
    if (direction) sendKeyPress({id: id, direction: direction})
  }
}
