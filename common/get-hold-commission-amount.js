const getHoldCommissionAmount = (operationAmount) => {
  let holdAmount = 0;
  const amount = Math.round(operationAmount || 0);

  switch (true) {
    case (amount >= 1000 && amount <=3000):
      holdAmount = 100
      break;

    case (amount > 3000 && amount <=5000):
      holdAmount = 150
      break;

    case (amount > 5000 && amount <=10000):
      holdAmount = 250
      break;

    case (amount > 10000 && amount <=15000):
      holdAmount = 350
      break;

    case (amount > 15000 && amount <=20000):
      holdAmount = 450
      break;

    case (amount > 20000 && amount <=30000):
      console.log('innn');
      holdAmount = 550
      break;

    case (amount > 30000 && amount <=50000):
      holdAmount = 1500
      break;

    case (amount > 50000):
      holdAmount = 2000
      break;

  }

  return parseFloat((holdAmount).toFixed(2))
};

export default getHoldCommissionAmount;