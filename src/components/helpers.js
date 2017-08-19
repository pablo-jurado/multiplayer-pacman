import mori from 'mori'

export function deepCopy (thing) {
  return JSON.parse(JSON.stringify(thing))
}

export const log = (...args) => {
  console.log(...args.map(mori.toJs))
}
