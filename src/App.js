import mori from 'mori'
import Game from './components/Game'
import HomePage from './components/HomePage'
import SelectColor from './components/SelectColor'
import { onHomePageMounted } from './components/HomePage'
import './App.css'

function App ({ state }) {
  const page = mori.get(state, 'page')
  const isGameReady = mori.getIn(state, ['game', 'isGameReady'])

  if (isGameReady) return <Game state={state} />
  if (page === 'home') return <HomePage onComponentWillMount={ onHomePageMounted } state={state} />
  if (page === 'select') return <SelectColor state={state} />
}

export default App
