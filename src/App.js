import { version, linkEvent } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import Game from './Game'
import HomePage from './HomePage'
import SelectColor from './SelectColor'
import { log } from './helpers'
import './App.css'
import './MediaQueries.css'

function App (state) {
  const page = mori.get(state, 'page')
  const isGameReady = mori.getIn(state, ['game', 'isGameReady'])

  if (isGameReady) return Game(state)
  else if (page === 'home') return HomePage(state)
  else if (page === 'select') return SelectColor(state)
}

export default App
