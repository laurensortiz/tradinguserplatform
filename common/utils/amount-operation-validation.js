import { isEmpty } from 'lodash';

const amountOperationValidation = (accountAmount, value) => {

  const regex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;

  return new Promise( (resolve, reject) => {

    if (parseFloat( value ) == 0) {
      reject( "La opereración debe ser mayor a 0" );
    }

    if (!isEmpty( value ) && !regex.test( value )) {
      reject( "Formato inválido del monto" );  // reject with error message
    }


    if (( parseFloat( accountAmount ) - parseFloat( value ) ) < 0) {
      reject( "El usuario no cuenta con Dinero disponibles" );  // reject with error message
    } else {
      resolve();
    }
  } );
}

export default amountOperationValidation;