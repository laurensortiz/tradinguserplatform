import _ from 'lodash';

const formatAxiosError = error => {
  const status = _.get(error, 'status', 500);
  const context = _.get(error, 'data.name', 'Tipo de error no registrado');
  const message = _.get(error, 'data.errors[0].message', 'Falla en solicitud');
  
  console.log('[=====  ERROR  =====>');
  console.log(error);
  console.log('<=====  /ERROR  =====]');

  return `Error [${status}]: Tipo: ${context} | Detalle: ${message}`;
};

export default formatAxiosError;