import fetch from '../../../common/fetch';

export const getInvestmentOperations = async (status) => {
  return fetch({
    method: 'get',
    url: `investment-operation`,
  });
};

export const addInvestmentOperation = async (investmentOperation) => {

  return fetch({
    method: 'post',
    url: 'investment-operation',
    data: investmentOperation
  });
};

export const editInvestmentOperation = async (investmentOperation) => {
  return fetch({
    method: 'put',
    url: `investment-operation/${investmentOperation.id}`,
    data: investmentOperation
  });
};

export const deleteInvestmentOperation = async (investmentOperationId) => {
  return fetch({
    method: 'delete',
    url: `investment-operation/${investmentOperationId}`,
  });
};