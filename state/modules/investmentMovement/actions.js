import { getInvestmentMovements, addInvestmentMovement, editInvestmentMovement, deleteInvestmentMovement } from './api';
import types from './types';
import { formatAxiosError } from "../../../common/utils";

// List InvestmentMovements
export const fetchGetInvestmentMovements = (operationId) => async dispatch => {
  dispatch( requestInvestmentMovements() );
  try {
    const res = await getInvestmentMovements(operationId);
    dispatch( requestInvestmentMovementsSuccess( res.data ) )
  } catch (e) {
    dispatch( requestInvestmentMovementsError( e.message ) )
  }

};

const requestInvestmentMovements = () => {
  return {
    type: types.INVESTMENT_MOVEMENTS_REQUEST
  }
};

const requestInvestmentMovementsSuccess = (movements) => {
  return {
    type: types.INVESTMENT_MOVEMENTS_SUCCESS,
    payload: movements
  }
};

const requestInvestmentMovementsError = (error) => {
  return {
    type: types.INVESTMENT_MOVEMENTS_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Add
export const fetchAddInvestmentMovement = (operation) => async dispatch => {
  dispatch( requestAddInvestmentMovement() );
  try {
    const res = await addInvestmentMovement(operation);
    dispatch( requestAddInvestmentMovementSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAddInvestmentMovementError( e.message ) )
  }

};

const requestAddInvestmentMovement = () => {
  return {
    type: types.INVESTMENT_MOVEMENT_ADD_REQUEST
  }
};

const requestAddInvestmentMovementSuccess = (movement) => {
  return {
    type: types.INVESTMENT_MOVEMENT_ADD_SUCCESS,
    payload: movement
  }
};

const requestAddInvestmentMovementError = (error) => {
  return {
    type: types.INVESTMENT_MOVEMENT_ADD_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Edit
export const fetchEditInvestmentMovement = (movement) => async dispatch => {
  dispatch( requestEditInvestmentMovement() );
  try {
    const res = await editInvestmentMovement(movement);
    dispatch( requestEditInvestmentMovementSuccess( res.data ) )
  } catch (e) {
    dispatch( requestEditInvestmentMovementError( e.message ) )
  }

};

const requestEditInvestmentMovement = () => {
  return {
    type: types.INVESTMENT_MOVEMENT_EDIT_REQUEST
  }
};

const requestEditInvestmentMovementSuccess = (movement) => {
  return {
    type: types.INVESTMENT_MOVEMENT_EDIT_SUCCESS,
    payload: movement
  }
};

const requestEditInvestmentMovementError = (error) => {
  return {
    type: types.INVESTMENT_MOVEMENT_EDIT_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Delete
export const fetchDeleteInvestmentMovement = (movementId) => async dispatch => {
  dispatch( requestDeleteInvestmentMovement() );
  try {
    const res = await deleteInvestmentMovement(movementId);
    dispatch( requestDeleteInvestmentMovementSuccess(res.data) )
  } catch (e) {
    dispatch( requestDeleteInvestmentMovementError( e.message ) )
  }

};

const requestDeleteInvestmentMovement = () => {
  return {
    type: types.INVESTMENT_MOVEMENT_DELETE_REQUEST
  }
};

const requestDeleteInvestmentMovementSuccess = (movement) => {
  return {
    type: types.INVESTMENT_MOVEMENT_DELETE_SUCCESS,
    payload: movement
  }
};

const requestDeleteInvestmentMovementError = (error) => {
  return {
    type: types.INVESTMENT_MOVEMENT_DELETE_ERROR,
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
  fetchGetInvestmentMovements,
  fetchAddInvestmentMovement,
  fetchEditInvestmentMovement,
  fetchDeleteInvestmentMovement,
  resetAfterRequest,
};