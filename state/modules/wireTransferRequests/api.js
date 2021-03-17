import fetch from '../../../common/fetch';

export const getWireTransferRequests = async (requestData) => {
  return fetch( {
    method: 'post',
    url: 'wire-transfer-request',
    data: requestData,
  } );
};

export const getWireTransferRequest = async (wireTransferRequestId) => {
  return fetch( {
    method: 'get',
    url: `wire-transfer-request/${wireTransferRequestId}`,
  } );
};

export const addWireTransferRequest = async (wireTransferRequest) => {
  return fetch( {
    method: 'post',
    url: 'wire-transfer-request/create',
    data: wireTransferRequest
  } );
};

export const getUserAccountWireTransferRequests = async (userAccount) => {
  return fetch( {
    method: 'get',
    url: `wire-transfer-request/user-account/${ userAccount.id }`,
  } );
};

export const editWireTransferRequest = async (wireTransferRequest) => {
  return fetch( {
    method: 'put',
    url: `wire-transfer-request/${ wireTransferRequest.id }`,
    data: wireTransferRequest
  } );
};

export const deleteWireTransferRequest = async (wireTransferRequestId) => {
  return fetch( {
    method: 'delete',
    url: `wire-transfer-request/${ wireTransferRequestId }`,
  } );
};