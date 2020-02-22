import fetch from '../../../common/fetch';

export const getMarketMovements = async (marketOperationId) => {

  return fetch({
    method: 'get',
    url: `market-movement/list/${marketOperationId}`,
  });
};

export const addMarketMovement = async (marketMovement) => {

  return fetch({
    method: 'post',
    url: 'market-movement',
    data: marketMovement
  });
};

export const editMarketMovement = async (marketMovement) => {
  return fetch({
    method: 'put',
    url: `market-movement/${marketMovement.id}`,
    data: marketMovement
  });
};

export const deleteMarketMovement = async (marketMovementId) => {
  return fetch({
    method: 'delete',
    url: `market-movement/${marketMovementId}`,
  });
};