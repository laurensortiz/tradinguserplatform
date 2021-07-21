import axios from 'axios'
import qs from 'qs'

const requestHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const instance = axios.create({
  baseURL: '/api/',
  headers: requestHeaders,
  withCredentials: true,
  paramsSerializer: (params) => {
    return qs.stringify(params)
  },
})

export default instance
