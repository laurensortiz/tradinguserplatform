import fetch from '../../../common/fetch';

export const getCommodities = async () => {
  return fetch( {
    method: 'get',
    url: 'commodities',
  } );
};

export const addCommodity = async (commodity) => {
  return fetch( {
    method: 'post',
    url: 'commodities',
    data: commodity
  } );
};

export const editCommodity = async (commodity) => {
  return fetch( {
    method: 'put',
    url: `commodities/${ commodity.id }`,
    data: commodity
  } );
};

export const deleteCommodity = async (commodityId) => {
  return fetch( {
    method: 'delete',
    url: `commodities/${ commodityId }`,
  } );
};