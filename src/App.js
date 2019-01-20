import mori from 'mori'
import Game from './components/Game'
import HomePage from './components/HomePage'
import SelectColor from './components/SelectColor'
import { onHomePageMounted } from './components/HomePage'
import './App.css'

function App ({ state }) {
  const page = mori.get(state, 'page')
  const isGameReady = mori.getIn(state, ['game', 'isGameReady'])
  const name = mori.get(state, 'name')
  const numberOfPlayers = mori.getIn(state, ['game', 'numberOfPlayers'])
  const countdown = mori.getIn(state, ['game', 'countdown'])
  const id = mori.get(state, 'id')
  const colorSelected = mori.get(state, 'colorSelected')
  const colors = mori.getIn(state, ['game', 'colors'])

  if (isGameReady) return <Game state={state} />

  if (page === 'home') {
    return <HomePage
      onComponentWillMount={onHomePageMounted}
      name={name}
      numberOfPlayers={numberOfPlayers}
      countdown={countdown} />
  }

  if (page === 'select') {
    return <SelectColor
      name={name}
      id={id}
      colorSelected={colorSelected}
      colors={colors}
      numberOfPlayers={numberOfPlayers}
      countdown={countdown} />
  }
}

export default App
