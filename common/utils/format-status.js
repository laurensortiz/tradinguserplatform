const formatStatus = status => {
  const detailStatus = {
    1: {
      name: 'Activo',
      color: '#87d068'
    },
    2: {
      name: 'Cerrado',
      color: '#f50'
    },
    3: {
      name: 'En Pausa',
      color: '#edc01c'
    }
  };
  return detailStatus[status] || 'Sin Definir'
};

export default formatStatus;
