import fetch from '../../../common/fetch';

export const getInvestmentMovements = async (investmentOperationId) => {

  return fetch({
    method: 'get',
    url: `investment-movement/list/${investmentOperationId}`,
  });
};

export const addInvestmentMovement = async (investmentMovement) => {

  return fetch({
    method: 'post',
    url: 'investment-movement',
    data: investmentMovement
  });
};

export const editInvestmentMovement = async (investmentMovement) => {
  return fetch({
    method: 'put',
    url: `investment-movement/${investmentMovement.id}`,
    data: investmentMovement
  });
};

export const deleteInvestmentMovement = async (investmentMovementId) => {
  return fetch({
    method: 'delete',
    url: `investment-movement/${investmentMovementId}`,
  });
};