import { version, linkEvent } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import Countdown from './Countdown'
import { createPlayer, updateColors } from '../index'
import playerSrc from '../img/player.png'
import { log } from '../helpers'

function savePlayer (name, colorSelected) {
  createPlayer(name, colorSelected)
}

function handleColorSelection (colorObj, event) {
  const color = event.target.id
  const { colorSelected, colors } = colorObj
  if (color === 'grey' || colorSelected) return

  let newColors = mori.map((c) => {
    if (c === color) return null
    return c
  }, colors)

  updateColors(color, newColors)
}

function SelectColor (state) {
  const name = mori.get(state, 'name')
  const id = mori.get(state, 'id')
  const colorSelected = mori.get(state, 'colorSelected')
  const colors = mori.getIn(state, ['game', 'colors'])

  if (colorSelected && !id) savePlayer(name, colorSelected)

  let colorsCollection = []

  mori.each(colors, (color) => {
    if (color) colorsCollection.push(<img id={color} src={playerSrc} alt={color} />)
    else colorsCollection.push(<img id='grey' src={playerSrc} alt={color} />)
  })

  return (
    <div className='home'>
      <h2>Hello {name}</h2>
      <p>Please select your player</p>
      <div className='preview' onClick={linkEvent({ colorSelected, colors }, handleColorSelection)}>
        {colorsCollection}
      </div>
      {Countdown(state)}
    </div>
  )
}

export default SelectColor
