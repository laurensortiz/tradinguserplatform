import fetch from '../../../common/fetch';

export const getUserAccountMovements = async (userAccountOperationId) => {

  return fetch({
    method: 'get',
    url: `user-account-movement/list/${userAccountOperationId}`,
  });
};

export const addUserAccountMovement = async (userAccountMovement) => {

  return fetch({
    method: 'post',
    url: 'user-account-movement',
    data: userAccountMovement
  });
};

export const editUserAccountMovement = async (userAccountMovement) => {
  return fetch({
    method: 'put',
    url: `user-account-movement/${userAccountMovement.id}`,
    data: userAccountMovement
  });
};

export const deleteUserAccountMovement = async (userAccountMovementId) => {
  return fetch({
    method: 'delete',
    url: `user-account-movement/${userAccountMovementId}`,
  });
};