import { getWireTransferRequests, getWireTransferRequest, addWireTransferRequest, editWireTransferRequest, deleteWireTransferRequest, getUserAccountWireTransferRequests } from './api';
import types from './types';
import { formatAxiosError } from "../../../common/utils";

// List WireTransferRequests
export const fetchGetWireTransferRequests = (requestData) => async dispatch => {
  dispatch( requestWireTransferRequests() );
  try {
    const res = await getWireTransferRequests(requestData);
    dispatch( requestWireTransferRequestsSuccess( res.data ) )
  } catch (e) {
    dispatch( requestWireTransferRequestsError( e.message ) )
  }

};

const requestWireTransferRequests = () => {
  return {
    type: types.WIRE_TRANSFER_REQUESTS_REQUEST
  }
};

const requestWireTransferRequestsSuccess = (wireTransferRequest) => {
  return {
    type: types.WIRE_TRANSFER_REQUESTS_SUCCESS,
    payload: wireTransferRequest
  }
};

const requestWireTransferRequestsError = (error) => {
  return {
    type: types.WIRE_TRANSFER_REQUESTS_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// WireTransferRequest
export const fetchGetWireTransferRequest = (wireTransferRequestId) => async dispatch => {
  dispatch( requestWireTransferRequest() );
  try {
    const res = await getWireTransferRequest(wireTransferRequestId);
    dispatch( requestWireTransferRequestSuccess( res.data ) )
  } catch (e) {
    dispatch( requestWireTransferRequestError( e.message ) )
  }

};

const requestWireTransferRequest = () => {
  return {
    type: types.WIRE_TRANSFER_REQUEST_REQUEST
  }
};

const requestWireTransferRequestSuccess = (wireTransferRequest) => {
  return {
    type: types.WIRE_TRANSFER_REQUEST_SUCCESS,
    payload: wireTransferRequest
  }
};

const requestWireTransferRequestError = (error) => {
  return {
    type: types.WIRE_TRANSFER_REQUEST_ERROR,
    payload: formatAxiosError(error.response)
  }
};

export const fetchGetUserAccountWireTransferRequests = (userAccountId) => async dispatch => {
  dispatch( requestUserAccountWireTransferRequests() );
  try {
    const res = await getUserAccountWireTransferRequests(userAccountId);
    dispatch( requestUserAccountWireTransferRequestsSuccess( res.data ) )
  } catch (e) {
    dispatch( requestUserAccountWireTransferRequestsError( e.message ) )
  }

};

const requestUserAccountWireTransferRequests = () => {
  return {
    type: types.WIRE_TRANSFER_REQUESTS_USER_ACCOUNT_REQUEST
  }
};

const requestUserAccountWireTransferRequestsSuccess = (wireTransferRequest) => {
  return {
    type: types.WIRE_TRANSFER_REQUESTS_USER_ACCOUNT_SUCCESS,
    payload: wireTransferRequest
  }
};

const requestUserAccountWireTransferRequestsError = (error) => {
  return {
    type: types.WIRE_TRANSFER_REQUESTS_USER_ACCOUNT_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Add
export const fetchAddWireTransferRequest = (user) => async dispatch => {
  dispatch( requestAddWireTransferRequest() );
  try {
    const res = await addWireTransferRequest(user);
    dispatch( requestAddWireTransferRequestSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAddWireTransferRequestError( e.message ) )
  }

};

const requestAddWireTransferRequest = () => {
  return {
    type: types.WIRE_TRANSFER_REQUEST_ADD_REQUEST
  }
};

const requestAddWireTransferRequestSuccess = (assetClass) => {
  return {
    type: types.WIRE_TRANSFER_REQUEST_ADD_SUCCESS,
    payload: assetClass
  }
};

const requestAddWireTransferRequestError = (error) => {
  return {
    type: types.WIRE_TRANSFER_REQUEST_ADD_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Edit
export const fetchEditWireTransferRequest = (assetClass) => async dispatch => {
  dispatch( requestEditWireTransferRequest() );
  try {
    const res = await editWireTransferRequest(assetClass);
    dispatch( requestEditWireTransferRequestSuccess( res.data ) )
  } catch (e) {
    dispatch( requestEditWireTransferRequestError( e.message ) )
  }

};

const requestEditWireTransferRequest = () => {
  return {
    type: types.WIRE_TRANSFER_REQUEST_EDIT_REQUEST
  }
};

const requestEditWireTransferRequestSuccess = (assetClass) => {
  return {
    type: types.WIRE_TRANSFER_REQUEST_EDIT_SUCCESS,
    payload: assetClass
  }
};

const requestEditWireTransferRequestError = (error) => {
  return {
    type: types.WIRE_TRANSFER_REQUEST_EDIT_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Delete
export const fetchDeleteWireTransferRequest = (assetClassId) => async dispatch => {
  dispatch( requestDeleteWireTransferRequest() );
  try {
    const res = await deleteWireTransferRequest(assetClassId);
    dispatch( requestDeleteWireTransferRequestSuccess(res.data) )
  } catch (e) {
    dispatch( requestDeleteWireTransferRequestError( e.message ) )
  }

};

const requestDeleteWireTransferRequest = () => {
  return {
    type: types.WIRE_TRANSFER_REQUEST_DELETE_REQUEST
  }
};

const requestDeleteWireTransferRequestSuccess = (assetClass) => {
  return {
    type: types.WIRE_TRANSFER_REQUEST_DELETE_SUCCESS,
    payload: assetClass
  }
};

const requestDeleteWireTransferRequestError = (error) => {
  return {
    type: types.WIRE_TRANSFER_REQUEST_DELETE_ERROR,
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
  fetchGetWireTransferRequests,
  fetchGetWireTransferRequest,
  fetchAddWireTransferRequest,
  fetchEditWireTransferRequest,
  fetchDeleteWireTransferRequest,
  resetAfterRequest,
  fetchGetUserAccountWireTransferRequests,
};