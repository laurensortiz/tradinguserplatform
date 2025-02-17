const formatStatus = (status, context) => {
  const detailStatus = {
    1: {
      name: 'Activo',
      color: '#039B01'
    },
    2: {
      name: context ? 'Cerrado' : 'Market Close',
      color: '#D63930'
    },
    3: {
      name: 'Hold',
      color: '#E2A11A'
    },
    4: {
      name: 'Vendido',
      color: '#414241'
    },
  };
  return detailStatus[status] || 'Sin Definir'
};

export default formatStatus;
