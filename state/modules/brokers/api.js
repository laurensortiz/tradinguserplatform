import fetch from '../../../common/fetch';

export const getBrokers = async () => {
  return fetch( {
    method: 'get',
    url: 'brokers',
  } );
};

export const addBroker = async (broker) => {
  return fetch( {
    method: 'post',
    url: 'brokers',
    data: broker
  } );
};

export const editBroker = async (broker) => {
  return fetch( {
    method: 'put',
    url: `brokers/${ broker.id }`,
    data: broker
  } );
};

export const deleteBroker = async (brokerId) => {
  return fetch( {
    method: 'delete',
    url: `brokers/${ brokerId }`,
  } );
};