const toFixNumber = (number, fractionDigit = 2) => {
  return parseFloat(number.toFixed(fractionDigit))
}

export default toFixNumber
