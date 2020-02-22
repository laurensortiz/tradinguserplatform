import { getMarketMovements, addMarketMovement, editMarketMovement, deleteMarketMovement } from './api';
import types from './types';

// List MarketMovements
export const fetchGetMarketMovements = (operationId) => async dispatch => {
  dispatch( requestMarketMovements() );
  try {
    const res = await getMarketMovements(operationId);
    dispatch( requestMarketMovementsSuccess( res.data ) )
  } catch (e) {
    dispatch( requestMarketMovementsError( e.message ) )
  }

};

const requestMarketMovements = () => {
  return {
    type: types.MARKET_MOVEMENTS_REQUEST
  }
};

const requestMarketMovementsSuccess = (movements) => {
  return {
    type: types.MARKET_MOVEMENTS_SUCCESS,
    payload: movements
  }
};

const requestMarketMovementsError = (error) => {
  return {
    type: types.MARKET_MOVEMENTS_ERROR,
    payload: error
  }
};

// Add
export const fetchAddMarketMovement = (operation) => async dispatch => {
  dispatch( requestAddMarketMovement() );
  try {
    const res = await addMarketMovement(operation);
    dispatch( requestAddMarketMovementSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAddMarketMovementError( e.message ) )
  }

};

const requestAddMarketMovement = () => {
  return {
    type: types.MARKET_MOVEMENT_ADD_REQUEST
  }
};

const requestAddMarketMovementSuccess = (movement) => {
  return {
    type: types.MARKET_MOVEMENT_ADD_SUCCESS,
    payload: movement
  }
};

const requestAddMarketMovementError = (error) => {
  return {
    type: types.MARKET_MOVEMENT_ADD_ERROR,
    payload: error
  }
};

// Edit
export const fetchEditMarketMovement = (movement) => async dispatch => {
  dispatch( requestEditMarketMovement() );
  try {
    const res = await editMarketMovement(movement);
    dispatch( requestEditMarketMovementSuccess( res.data ) )
  } catch (e) {
    dispatch( requestEditMarketMovementError( e.message ) )
  }

};

const requestEditMarketMovement = () => {
  return {
    type: types.MARKET_MOVEMENT_EDIT_REQUEST
  }
};

const requestEditMarketMovementSuccess = (movement) => {
  return {
    type: types.MARKET_MOVEMENT_EDIT_SUCCESS,
    payload: movement
  }
};

const requestEditMarketMovementError = (error) => {
  return {
    type: types.MARKET_MOVEMENT_EDIT_ERROR,
    payload: error
  }
};

// Delete
export const fetchDeleteMarketMovement = (movementId) => async dispatch => {
  dispatch( requestDeleteMarketMovement() );
  try {
    const res = await deleteMarketMovement(movementId);
    dispatch( requestDeleteMarketMovementSuccess(res.data) )
  } catch (e) {
    dispatch( requestDeleteMarketMovementError( e.message ) )
  }

};

const requestDeleteMarketMovement = () => {
  return {
    type: types.MARKET_MOVEMENT_DELETE_REQUEST
  }
};

const requestDeleteMarketMovementSuccess = (movement) => {
  return {
    type: types.MARKET_MOVEMENT_DELETE_SUCCESS,
    payload: movement
  }
};

const requestDeleteMarketMovementError = (error) => {
  return {
    type: types.MARKET_MOVEMENT_DELETE_ERROR,
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
  fetchGetMarketMovements,
  fetchAddMarketMovement,
  fetchEditMarketMovement,
  fetchDeleteMarketMovement,
  resetAfterRequest,
};