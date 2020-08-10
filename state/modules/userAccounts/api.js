import fetch from '../../../common/fetch';

export const getAllUserAccounts = async (reqParams) => {
  return fetch({
    method: 'post',
    url: `user-accounts`,
    data: reqParams
  });
};


export const getUserAccounts = async (userId) => {
  return fetch({
    method: 'get',
    url: `user-accounts/user/${userId}`,
  });
};

export const getUserAccountHistoryReport = async (userAccountId) => {
  return fetch({
    method: 'get',
    url: `user-accounts/${userAccountId}/report`
  });
};

export const addUserAccount = async (userAccount) => {

  return fetch({
    method: 'post',
    url: 'user-accounts/new',
    data: userAccount
  });
};

export const editUserAccount = async (userAccount) => {
  return fetch({
    method: 'put',
    url: `user-accounts/${userAccount.id}`,
    data: userAccount
  });
};

export const deleteUserAccount = async (userAccountId) => {
  return fetch({
    method: 'delete',
    url: `user-accounts/${userAccountId}`,
  });
};