import { getBrokers, addBroker, editBroker, deleteBroker } from './api';
import types from './types';

// List Brokers
export const fetchGetBrokers = () => async dispatch => {
  dispatch( requestBrokers() );
  try {
    const res = await getBrokers();
    dispatch( requestBrokersSuccess( res.data ) )
  } catch (e) {
    dispatch( requestBrokersError( e.message ) )
  }

};

const requestBrokers = () => {
  return {
    type: types.BROKERS_REQUEST
  }
};

const requestBrokersSuccess = (products) => {
  return {
    type: types.BROKERS_SUCCESS,
    payload: products
  }
};

const requestBrokersError = (error) => {
  return {
    type: types.BROKERS_ERROR,
    payload: error
  }
};

// Add
export const fetchAddBroker = (user) => async dispatch => {
  dispatch( requestAddBroker() );
  try {
    const res = await addBroker(user);
    dispatch( requestAddBrokerSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAddBrokerError( e.message ) )
  }

};

const requestAddBroker = () => {
  return {
    type: types.BROKER_ADD_REQUEST
  }
};

const requestAddBrokerSuccess = (broker) => {
  return {
    type: types.BROKER_ADD_SUCCESS,
    payload: broker
  }
};

const requestAddBrokerError = (error) => {
  return {
    type: types.BROKER_ADD_ERROR,
    payload: error
  }
};

// Edit
export const fetchEditBroker = (broker) => async dispatch => {
  dispatch( requestEditBroker() );
  try {
    const res = await editBroker(broker);
    dispatch( requestEditBrokerSuccess( res.data ) )
  } catch (e) {
    dispatch( requestEditBrokerError( e.message ) )
  }

};

const requestEditBroker = () => {
  return {
    type: types.BROKER_EDIT_REQUEST
  }
};

const requestEditBrokerSuccess = (broker) => {
  return {
    type: types.BROKER_EDIT_SUCCESS,
    payload: broker
  }
};

const requestEditBrokerError = (error) => {
  return {
    type: types.BROKER_EDIT_ERROR,
    payload: error
  }
};

// Delete
export const fetchDeleteBroker = (brokerId) => async dispatch => {
  dispatch( requestDeleteBroker() );
  try {
    const res = await deleteBroker(brokerId);
    dispatch( requestDeleteBrokerSuccess(res.data) )
  } catch (e) {
    dispatch( requestDeleteBrokerError( e.message ) )
  }

};

const requestDeleteBroker = () => {
  return {
    type: types.BROKER_DELETE_REQUEST
  }
};

const requestDeleteBrokerSuccess = (broker) => {
  return {
    type: types.BROKER_DELETE_SUCCESS,
    payload: broker
  }
};

const requestDeleteBrokerError = (error) => {
  return {
    type: types.BROKER_DELETE_ERROR,
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
  fetchGetBrokers,
  fetchAddBroker,
  fetchEditBroker,
  fetchDeleteBroker,
  resetAfterRequest,
};