import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'

window.addEventListener('keydown', checkArrow)

function checkArrow (event) {
  const keyValue = event.keyCode
  const left = 37
  const up = 38
  const right = 39
  const down = 40
  if (keyValue === left) window.appState = mori.assocIn(window.appState, ['players', 0, 'direction'], 'left')
  if (keyValue === right) window.appState = mori.assocIn(window.appState, ['players', 0, 'direction'], 'right')
  if (keyValue === up) window.appState = mori.assocIn(window.appState, ['players', 0, 'direction'], 'top')
  if (keyValue === down) window.appState = mori.assocIn(window.appState, ['players', 0, 'direction'], 'bottom')

  // this is just for testing
  if (keyValue === 65) window.appState = mori.assocIn(window.appState, ['players', 1, 'direction'], 'left')
  if (keyValue === 68) window.appState = mori.assocIn(window.appState, ['players', 1, 'direction'], 'right')
  if (keyValue === 87) window.appState = mori.assocIn(window.appState, ['players', 1, 'direction'], 'top')
  if (keyValue === 83) window.appState = mori.assocIn(window.appState, ['players', 1, 'direction'], 'bottom')
}
