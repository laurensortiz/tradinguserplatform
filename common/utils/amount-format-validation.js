import { isEmpty } from 'lodash';

const amountFormatValidation = (rule, amount) => {
  const regex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;

  return new Promise( (resolve, reject) => {

    if (!isEmpty( amount ) && amount != 0) {
      if (regex.test(amount)) {
        resolve();
      } else {
        reject( "Formato inválido del monto" );  // reject with error message
      }
    } else {
      resolve();
    }

  } );

}

export default amountFormatValidation;