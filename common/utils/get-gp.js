import moment from "moment";

const getGP = (amount, percentage) => {
  const pct = parseFloat(percentage) / 100;
  return {
    gpInversion: amount * (1+ pct),
    gpAmount: amount * (pct)
  };
};

export default getGP;