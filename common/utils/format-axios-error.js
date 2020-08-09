import _ from 'lodash';

const formatAxiosError = error => {
  console.log('[=====  RESPOSNSE  =====>');
  console.log(error);
  console.log('<=====  /RESPOSNSE  =====]');
  const status = _.get(error, 'status', 500);
  const context = _.get(error, 'statusText', 'Tipo de error no registrado');
  const message = _.get(error, 'data.message', 'Falla en solicitud');

  return `Error [${status}]: Tipo: ${context} | Detalle: ${message}`;
};

export default formatAxiosError;