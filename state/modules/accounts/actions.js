import { getAccounts, addAccount, editAccount, deleteAccount } from './api';
import types from './types';
import { formatAxiosError } from "../../../common/utils";

// List Accounts
export const fetchGetAccounts = () => async dispatch => {
  dispatch( requestAccounts() );
  try {
    const res = await getAccounts();
    dispatch( requestAccountsSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAccountsError( e.message ) )
  }

};

const requestAccounts = () => {
  return {
    type: types.ACCOUNTS_REQUEST
  }
};

const requestAccountsSuccess = (products) => {
  return {
    type: types.ACCOUNTS_SUCCESS,
    payload: products
  }
};

const requestAccountsError = (error) => {
  return {
    type: types.ACCOUNTS_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Add
export const fetchAddAccount = (user) => async dispatch => {
  dispatch( requestAddAccount() );
  try {
    const res = await addAccount(user);
    dispatch( requestAddAccountSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAddAccountError( e.message ) )
  }

};

const requestAddAccount = () => {
  return {
    type: types.ACCOUNT_ADD_REQUEST
  }
};

const requestAddAccountSuccess = (account) => {
  return {
    type: types.ACCOUNT_ADD_SUCCESS,
    payload: account
  }
};

const requestAddAccountError = (error) => {
  return {
    type: types.ACCOUNT_ADD_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Edit
export const fetchEditAccount = (account) => async dispatch => {
  dispatch( requestEditAccount() );
  try {
    const res = await editAccount(account);
    dispatch( requestEditAccountSuccess( res.data ) )
  } catch (e) {
    dispatch( requestEditAccountError( e.message ) )
  }

};

const requestEditAccount = () => {
  return {
    type: types.ACCOUNT_EDIT_REQUEST
  }
};

const requestEditAccountSuccess = (account) => {
  return {
    type: types.ACCOUNT_EDIT_SUCCESS,
    payload: account
  }
};

const requestEditAccountError = (error) => {
  return {
    type: types.ACCOUNT_EDIT_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Delete
export const fetchDeleteAccount = (accountId) => async dispatch => {
  dispatch( requestDeleteAccount() );
  try {
    const res = await deleteAccount(accountId);
    dispatch( requestDeleteAccountSuccess(res.data) )
  } catch (e) {
    dispatch( requestDeleteAccountError( e.message ) )
  }

};

const requestDeleteAccount = () => {
  return {
    type: types.ACCOUNT_DELETE_REQUEST
  }
};

const requestDeleteAccountSuccess = (account) => {
  return {
    type: types.ACCOUNT_DELETE_SUCCESS,
    payload: account
  }
};

const requestDeleteAccountError = (error) => {
  return {
    type: types.ACCOUNT_DELETE_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Reset After any request
export const resetAfterRequest = () => {
  return {
    type: types.RESET_AFTER_REQUEST,
  }
};

export default {
  fetchGetAccounts,
  fetchAddAccount,
  fetchEditAccount,
  fetchDeleteAccount,
  resetAfterRequest,
};