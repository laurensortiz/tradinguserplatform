import { getInvestmentOperations, addInvestmentOperation, editInvestmentOperation, deleteInvestmentOperation } from './api';
import types from './types';

// List InvestmentOperations
export const fetchGetInvestmentOperations = () => async dispatch => {
  dispatch( requestInvestmentOperations() );
  try {
    const res = await getInvestmentOperations();
    dispatch( requestInvestmentOperationsSuccess( res.data ) )
  } catch (e) {
    dispatch( requestInvestmentOperationsError( e.message ) )
  }

};

const requestInvestmentOperations = () => {
  return {
    type: types.INVESTMENT_OPERATIONS_REQUEST
  }
};

const requestInvestmentOperationsSuccess = (projects) => {
  return {
    type: types.INVESTMENT_OPERATIONS_SUCCESS,
    payload: projects
  }
};

const requestInvestmentOperationsError = (error) => {
  return {
    type: types.INVESTMENT_OPERATIONS_ERROR,
    payload: error
  }
};

// Add
export const fetchAddInvestmentOperation = (user) => async dispatch => {
  dispatch( requestAddInvestmentOperation() );
  try {
    const res = await addInvestmentOperation(user);
    dispatch( requestAddInvestmentOperationSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAddInvestmentOperationError( e.message ) )
  }

};

const requestAddInvestmentOperation = () => {
  return {
    type: types.INVESTMENT_OPERATION_ADD_REQUEST
  }
};

const requestAddInvestmentOperationSuccess = (project) => {
  return {
    type: types.INVESTMENT_OPERATION_ADD_SUCCESS,
    payload: project
  }
};

const requestAddInvestmentOperationError = (error) => {
  return {
    type: types.INVESTMENT_OPERATION_ADD_ERROR,
    payload: error
  }
};

// Edit
export const fetchEditInvestmentOperation = (project) => async dispatch => {
  dispatch( requestEditInvestmentOperation() );
  try {
    const res = await editInvestmentOperation(project);
    dispatch( requestEditInvestmentOperationSuccess( res.data ) )
  } catch (e) {
    dispatch( requestEditInvestmentOperationError( e.message ) )
  }

};

const requestEditInvestmentOperation = () => {
  return {
    type: types.INVESTMENT_OPERATION_EDIT_REQUEST
  }
};

const requestEditInvestmentOperationSuccess = (project) => {
  return {
    type: types.INVESTMENT_OPERATION_EDIT_SUCCESS,
    payload: project
  }
};

const requestEditInvestmentOperationError = (error) => {
  return {
    type: types.INVESTMENT_OPERATION_EDIT_ERROR,
    payload: error
  }
};

// Delete
export const fetchDeleteInvestmentOperation = (projectId) => async dispatch => {
  dispatch( requestDeleteInvestmentOperation() );
  try {
    const res = await deleteInvestmentOperation(projectId);
    dispatch( requestDeleteInvestmentOperationSuccess(res.data) )
  } catch (e) {
    dispatch( requestDeleteInvestmentOperationError( e.message ) )
  }

};

const requestDeleteInvestmentOperation = () => {
  return {
    type: types.INVESTMENT_OPERATION_DELETE_REQUEST
  }
};

const requestDeleteInvestmentOperationSuccess = (project) => {
  return {
    type: types.INVESTMENT_OPERATION_DELETE_SUCCESS,
    payload: project
  }
};

const requestDeleteInvestmentOperationError = (error) => {
  return {
    type: types.INVESTMENT_OPERATION_DELETE_ERROR,
    payload: error
  }
};

// Reset After any request
export const resetAfterRequest = () => {
  return {
    type: types.RESET_AFTER_REQUEST,
  }
};

export default {
  fetchGetInvestmentOperations,
  fetchAddInvestmentOperation,
  fetchEditInvestmentOperation,
  fetchDeleteInvestmentOperation,
  resetAfterRequest,
};