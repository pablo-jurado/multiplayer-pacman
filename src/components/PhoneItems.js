import Score from './Score'
import Timer from './Timer'
import Controller from './Controller'

const PhoneItems = ({ players, timer, id }) => (
  <div className='phone-items'>
    <header>
      <h2>Multiplayer Pacman</h2>
    </header>
    <Score players={players} />
    <Timer timer={timer} />
    <Controller id={id} />
  </div>
)


export default PhoneItems
