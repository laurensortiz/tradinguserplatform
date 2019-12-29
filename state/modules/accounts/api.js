import fetch from '../../../common/fetch';

export const getAccounts = async () => {
  return fetch( {
    method: 'get',
    url: 'accounts',
  } );
};

export const addAccount = async (account) => {
  return fetch( {
    method: 'post',
    url: 'accounts',
    data: account
  } );
};

export const editAccount = async (account) => {
  return fetch( {
    method: 'put',
    url: `accounts/${ account.id }`,
    data: account
  } );
};

export const deleteAccount = async (accountId) => {
  return fetch( {
    method: 'delete',
    url: `accounts/${ accountId }`,
  } );
};