const formatStatus = (status, context) => {
  const detailStatus = {
    1: {
      name: 'active',
      color: '#039B01'
    },
    2: {
      name: context ? 'close' : 'marketClose',
      color: '#D63930'
    },
    3: {
      name: 'hold',
      color: '#E2A11A'
    },
    4: {
      name: 'sold',
      color: '#414241'
    },
  };
  return detailStatus[status] || '--'
};

export default formatStatus;
