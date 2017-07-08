import { version } from 'inferno'
import Component from 'inferno-component'
import './App.css'

function move(direction) {
  console.log('move ' + direction)
}

function checkArrow (event) {
  const keyValue = event.keyCode
  const left = 37
  const up = 38
  const right = 39
  const down = 40

  if (keyValue === left) move('left')
  if (keyValue === right) move('right')
  if (keyValue === up) move('up')
  if (keyValue === down) move('down')
}

function Player () {
  return (
    <div className='player' />
  )
}

function Board () {
  return (
    <div className='game-board'>
      {Player()}
    </div>
  )
}

function App () {
  return (
    <div tabIndex='0' onkeydown={checkArrow} className='game'>
      <div>
        <h2>Multiplayer Pacman</h2>
        {Board()}
      </div>
    </div>
  )
}

export default App
