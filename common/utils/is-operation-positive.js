const isOperationPositive = (amount, initialAmount) => {

  return (parseFloat(amount) - parseFloat(initialAmount)) >= 0
};

export default isOperationPositive;