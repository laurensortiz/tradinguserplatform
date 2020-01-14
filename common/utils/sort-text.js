const SortText = (valueA, valueB) => {
  if (isNaN(valueA) || isNaN(valueB)) {
    return valueA.length - valueB.length
  } else {
    return Number(valueA) - Number(valueB);
  }
};

export default SortText;