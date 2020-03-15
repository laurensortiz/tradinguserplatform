import fetch from '../../../common/fetch';

export const getAllUserAccounts = async () => {
  return fetch({
    method: 'get',
    url: `user-accounts`,
  });
};


export const getUserAccounts = async (userId) => {
  return fetch({
    method: 'get',
    url: `user-accounts/user/${userId}`,
  });
};

export const addUserAccount = async (userAccount) => {

  return fetch({
    method: 'post',
    url: 'user-accounts',
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