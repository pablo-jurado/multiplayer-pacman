import { version, linkEvent } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import { sendNewColors, createNewPlayer } from './Socket'
import Countdown from './Countdown'
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

function SelectColor (state) {
  const name = mori.get(state, 'name')
  const id = mori.get(state, 'id')
  const colorSelected = mori.get(state, 'colorSelected')
  const colors = mori.getIn(state, ['game', 'colors'])
  
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
      {Countdown(state)}
    </div>
  )
}

export default SelectColor
