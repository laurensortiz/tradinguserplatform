const SortText = (valueA, valueB) => {
  if (isNaN(valueA) || isNaN(valueB)) {
    return valueA.localeCompare(valueB)
  } else {
    return Number(valueA) - Number(valueB);
  }
};

export default SortText;