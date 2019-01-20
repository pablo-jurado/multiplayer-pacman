import mori from 'mori'

function Player (player, board) {
  const color = mori.get(player, 'color')
  const speed = mori.get(player, 'speed')
  const isWeak = mori.get(player, 'isWeak')
  const isDead = mori.get(player, 'isDead')
  const hasPower = mori.get(player, 'hasPower')
  const yMax = mori.count(board)
  const xRow = mori.count(mori.get(board, 0))

  let x = mori.get(player, 'x')
  let y = mori.get(player, 'y')
  let classVal = 'player ' + color
  let xPercent = x * 100 / xRow
  let yPercent = y * 100 / yMax

  let styles = {
    left: xPercent + '%',
    top: yPercent + '%',
    transition: 'all ' + speed + '00ms linear'
  }

  if (hasPower) classVal += ' hasPower'
  if (isWeak) classVal += ' isWeak'
  if (isDead) classVal += ' dead'

  if (x <= 0 || x >= xRow - 1) styles.display = 'none'

  return <div className={classVal} style={styles} />
}

export default Player
