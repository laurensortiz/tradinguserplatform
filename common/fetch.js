import axios from 'axios';

const requestHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const instance = axios.create({
  baseURL: '/api/',
  headers: requestHeaders,
  withCredentials: true,
});

export default instance;