import { version } from 'inferno'
import Component from 'inferno-component'
import { log } from './helpers'
import mori from 'mori'
import { updateChat } from './Socket'

function handleSubmit (event) {
  event.preventDefault()
  console.log(event.target.scrollTop)
  const text = mori.get(window.appState, 'chatInput')
  if (text) {
    const msg = {
      user: mori.get(window.appState, 'name'),
      msg: text,
    }
    updateChat(msg)
    window.appState = mori.assocIn(window.appState, ['chatInput'], '')
  }
}

function handleInput (event) {
  window.appState = mori.assocIn(window.appState, ['chatInput'], event.target.value)
}

function Chat (state) {
  const chat = mori.toJs(mori.getIn(state, ['game', 'chat']))
  const text = mori.getIn(state, ['chatInput'])
  let chatData = []

  chatData = chat.map(function (item, i) {
    return <div key={i}>{item.user}: {item.msg}</div>
  })

  return (
    <form onSubmit={handleSubmit} className='chat'>
      <p>chat</p>
      <div className='chat-text'>
        {chatData}
      </div>
      <div>
        <input onInput={handleInput} type='text' value={text} />
        <input type='submit' value='send' />
      </div>
    </form>
  )
}

export default Chat
