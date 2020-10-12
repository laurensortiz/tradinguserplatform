import fetch from '../../../common/fetch';

export const getMarketOperations = async (status, userAccountId) => {
  return fetch({
    method: 'get',
    url: `market-operation/${status}/${userAccountId}`,
  });
};

export const addMarketOperation = async (marketOperation) => {

  return fetch({
    method: 'post',
    url: 'market-operation',
    data: marketOperation
  });
};

export const editMarketOperation = async (marketOperation) => {
  return fetch({
    method: 'put',
    url: `market-operation/${marketOperation.id}`,
    data: marketOperation
  });
};

export const deleteMarketOperation = async (marketOperationId) => {
  return fetch({
    method: 'delete',
    url: `market-operation/${marketOperationId}`,
  });
};

export const bulkUpdateMarketOperation = async (bulkUpdateBatch) => {
  return fetch({
    method: 'post',
    url: `market-operation/bulk-update`,
    data: bulkUpdateBatch
  });
};