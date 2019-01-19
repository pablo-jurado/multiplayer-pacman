import mori from 'mori'

export function deepCopy (thing) {
  return JSON.parse(JSON.stringify(thing))
}

export const log = (...args) => {
  console.log(...args.map(mori.toJs))
}

export function uuid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
}

export function addZero (str) {
  let newString = str
  if (str.length === 1) newString = '0' + str
  if (str.length === 0) newString = '00' + str
  return newString
}
