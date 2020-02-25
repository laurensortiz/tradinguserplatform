const getGPInversion = (currentAmount, gpAmount) => {
  return (parseFloat(currentAmount) + parseFloat(gpAmount))
};

export default getGPInversion;