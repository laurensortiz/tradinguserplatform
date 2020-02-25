import { FormatCurrency } from "./index";

const displayTableAmount = amount => {
  if (amount) {
    return `${ FormatCurrency.format(amount) }`
  } else {
    return '$0.00'
  }
};

export default displayTableAmount;