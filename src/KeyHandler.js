import mori from 'mori'
import { sendKeyPress } from './Socket'
import { log } from './helpers'

export function addKeyListener (id) {
  window.addEventListener('keydown', checkArrow)

  function checkArrow (event) {
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

    if (direction) sendKeyPress({id: id, direction: direction})
  }
}
