const numberFromString = (txt) => {
  let number = txt.match(/\d/g)
  return number.join('')
}

export default numberFromString
