import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import Board from './Board'
import io from 'socket.io-client'
import './App.css'

var socket = io(`http://localhost:3100`)

function testServer () {
  socket.emit('test', 'hello')
}

socket.on('testBack', function (data) {
  console.log(data)
})

export const log = (...args) => {
  console.log(...args.map(mori.toJs))
}

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

function resetAllPlayers () {
  let players = mori.get(window.appState, 'players')
  mori.each(players, function (p) {
    const id = mori.get(p, 'id')
    window.appState = mori.assocIn(window.appState, ['players', id, 'isWeak'], false)
    window.appState = mori.assocIn(window.appState, ['players', id, 'hasPower'], false)
  })
}

function updatePowerTimer (powerTimer, isPowerMode) {
  if (isPowerMode) {
    if (powerTimer === 50) {
      // when timer is done, reset all values
      window.appState = mori.assoc(window.appState, 'powerTimer', 0)
      window.appState = mori.assoc(window.appState, 'isPowerMode', false)
      resetAllPlayers()
    }
    // increments timer by 1 every 100ms
    window.appState = mori.updateIn(window.appState, ['powerTimer'], mori.inc)
  }
}

function Score (players) {
  let playersArr = []
  mori.each(players, function (p) {
    let id = mori.get(p, 'id')
    let score = mori.get(p, 'score')

    playersArr.push(
      <div className='score'>
        <div>Player{id}</div><div>Score: {score}</div>
      </div>
    )
  })

  return (
    <div className='score-board'>
      {playersArr}
    </div>
  )
}

function boolNot (x) {
  return !x
}

function toggle3D () {
  window.appState = mori.updateIn(window.appState, ['is3D'], boolNot)
}

export function App (state) {
  let gameClass = 'game'
  let class3D = null
  const players = mori.get(state, 'players')
  const powerTimer = mori.get(state, 'powerTimer')
  const isPowerMode = mori.get(state, 'isPowerMode')
  const is3D = mori.get(state, 'is3D')

  updatePowerTimer(powerTimer, isPowerMode)

  if (isPowerMode) gameClass = 'game power-mode'
  if (is3D) class3D = 'is3d'
  if (!is3D) class3D = null

  return (
    <div className={gameClass}>
      <div className={class3D}>
        <h2>Multiplayer Pacman</h2>
        {Score(players)}
        {Board(state)}
        <button className='button-3d' onClick={testServer}>send test to server</button>
      </div>
    </div>
  )
}
