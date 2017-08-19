import { version, linkEvent } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import Game from './components/Game'
import HomePage from './components/HomePage'
import SelectColor from './components/SelectColor'
import './App.css'

function App (state) {
  const page = mori.get(state, 'page')
  const isGameReady = mori.getIn(state, ['game', 'isGameReady'])

  if (isGameReady) return Game(state)
  else if (page === 'home') return HomePage(state)
  else if (page === 'select') return SelectColor(state)
}

export default App
