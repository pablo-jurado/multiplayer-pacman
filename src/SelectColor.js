import { version, linkEvent } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import { sendNewColors, createNewPlayer } from './Socket'
import { log } from './helpers'
import playerSrc from './img/player.png'

function uuid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
}

function createPlayer (name, colorSelected) {
  const id = uuid()
  createNewPlayer({name: name, color: colorSelected, id: id})
  window.appState = mori.assoc(window.appState, 'id', id)
}

function handleColorSelection (colorSelected, event) {
  const color = event.target.id
  if (color === 'grey' || colorSelected) return
  const colors = mori.getIn(window.appState, ['game', 'colors'])
  let newColors = mori.map(function (c) {
    if (c === color) return null
    else return c
  }, colors)

  window.appState = mori.assoc(window.appState, 'colorSelected', color)
  sendNewColors(newColors)
}

function addZero (str) {
  let newString = str
  if (str.length === 1) newString = '0' + str
  if (str.length === 0) newString = '00' + str
  return newString
}

function SelectColor (state) {
  const name = mori.get(state, 'name')
  const id = mori.get(state, 'id')
  const colorSelected = mori.get(state, 'colorSelected')
  const colors = mori.getIn(state, ['game', 'colors'])
  const numberOfPlayers = mori.getIn(state, ['game', 'numberOfPlayers'])
  const countdown = mori.getIn(state, ['game', 'countdown'])
  // countdown unit is 300-- every 100ms
  let time = null

  if (countdown !== 150) {
    let strCountdown = countdown.toString()
    let seconds = strCountdown.slice(0, strCountdown.length - 1)
    let milliseconds = strCountdown.slice(strCountdown.length - 1, strCountdown.length + 1)
    time = addZero(seconds) + ':' + addZero(milliseconds)
  }

  if (colorSelected && !id) createPlayer(name, colorSelected)

  let colorsCollection = []

  mori.each(colors, function (color) {
    if (color) colorsCollection.push(<img id={color} src={playerSrc} alt={color} />)
    else colorsCollection.push(<img id='grey' src={playerSrc} alt={color} />)
  })

  return (
    <div className='home'>
      <h2>Welcome {name}</h2>
      <p>Please select your player</p>
      <div className='preview' onClick={linkEvent(colorSelected, handleColorSelection)}>
        {colorsCollection}
      </div>
      <h4>Next Game will start in: {time}</h4>
      <h4>Players online: {numberOfPlayers}</h4>
    </div>
  )
}

export default SelectColor
