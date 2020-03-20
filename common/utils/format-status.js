const formatStatus = status => {
  const detailStatus = {
    1: {
      name: 'Activo',
      color: '#039B01'
    },
    2: {
      name: 'Cerrado',
      color: '#D63930'
    },
    3: {
      name: 'Hold',
      color: '#E2A11A'
    }
  };
  return detailStatus[status] || 'Sin Definir'
};

export default formatStatus;
