import _ from 'lodash';

const formatAxiosError = error => {
  const status = _.get(error, 'status', 500);
  const context = _.get(error, 'statusText', 'Tipo de error no registrado');
  const message = _.get(error, 'data.message', 'Falla en solicitud');

  return `Error [${status}]: Tipo: ${context} | Detalle: ${message}`;
};

export default formatAxiosError;