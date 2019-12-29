import fetch from '../../../common/fetch';

export const getProducts = async () => {
  return fetch( {
    method: 'get',
    url: 'products',
  } );
};

export const addProduct = async (product) => {
  return fetch( {
    method: 'post',
    url: 'products',
    data: product
  } );
};

export const editProduct = async (product) => {
  return await fetch( {
    method: 'put',
    url: `products/${ product.id }`,
    data: product
  } );
};

export const deleteProduct = async (productId) => {
  return await fetch( {
    method: 'delete',
    url: `products/${ productId }`,
  } );
};