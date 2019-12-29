import { getProducts, addProduct, editProduct, deleteProduct } from './api';
import types from './types';

// List Products
export const fetchGetProducts = () => async dispatch => {
  dispatch( requestProducts() );
  try {
    const res = await getProducts();
    dispatch( requestProductsSuccess( res.data ) )
  } catch (e) {
    dispatch( requestProductsError( e.message ) )
  }

};

const requestProducts = () => {
  return {
    type: types.PRODUCTS_REQUEST
  }
};

const requestProductsSuccess = (products) => {
  return {
    type: types.PRODUCTS_SUCCESS,
    payload: products
  }
};

const requestProductsError = (error) => {
  return {
    type: types.PRODUCTS_ERROR,
    payload: error
  }
};

// Add
export const fetchAddProduct = (user) => async dispatch => {
  dispatch( requestAddProduct() );
  try {
    const res = await addProduct(user);
    dispatch( requestAddProductSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAddProductError( e.message ) )
  }

};

const requestAddProduct = () => {
  return {
    type: types.PRODUCT_ADD_REQUEST
  }
};

const requestAddProductSuccess = (jobTitle) => {
  return {
    type: types.PRODUCT_ADD_SUCCESS,
    payload: jobTitle
  }
};

const requestAddProductError = (error) => {
  return {
    type: types.PRODUCT_ADD_ERROR,
    payload: error
  }
};

// Edit
export const fetchEditProduct = (jobTitle) => async dispatch => {
  dispatch( requestEditProduct() );
  try {
    const res = await editProduct(jobTitle);
    dispatch( requestEditProductSuccess( res.data ) )
  } catch (e) {
    dispatch( requestEditProductError( e.message ) )
  }

};

const requestEditProduct = () => {
  return {
    type: types.PRODUCT_EDIT_REQUEST
  }
};

const requestEditProductSuccess = (jobTitle) => {
  return {
    type: types.PRODUCT_EDIT_SUCCESS,
    payload: jobTitle
  }
};

const requestEditProductError = (error) => {
  return {
    type: types.PRODUCT_EDIT_ERROR,
    payload: error
  }
};

// Delete
export const fetchDeleteProduct = (jobTitleId) => async dispatch => {
  dispatch( requestDeleteProduct() );
  try {
    const res = await deleteProduct(jobTitleId);
    dispatch( requestDeleteProductSuccess(res.data) )
  } catch (e) {
    dispatch( requestDeleteProductError( e.message ) )
  }

};

const requestDeleteProduct = () => {
  return {
    type: types.PRODUCT_DELETE_REQUEST
  }
};

const requestDeleteProductSuccess = (jobTitle) => {
  return {
    type: types.PRODUCT_DELETE_SUCCESS,
    payload: jobTitle
  }
};

const requestDeleteProductError = (error) => {
  return {
    type: types.PRODUCT_DELETE_ERROR,
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
  fetchGetProducts,
  fetchAddProduct,
  fetchEditProduct,
  fetchDeleteProduct,
  resetAfterRequest,
};