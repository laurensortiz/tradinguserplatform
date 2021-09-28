import FormatCurrencyTwo from './format-currency'
import FormatCurrencyThree from './format-currency-3'
import FormatCurrencyFour from './format-currency-4'

const assetsWithTwoDigits = [54, 55, 59, 62, 63, 64, 65, 66, 67, 68]
const assetsWithThreeDigits = [53, 58, 60]
const assetsWithFourDigits = [10, 56, 57, 61]

const currencyType = (assetId, amount) => {
  if (assetsWithThreeDigits.includes(assetId)) {
    return FormatCurrencyThree.format(amount)
  } else if (assetsWithFourDigits.includes(assetId)) {
    return FormatCurrencyFour.format(amount)
  } else {
    return FormatCurrencyTwo.format(amount)
  }
}

export default currencyType
