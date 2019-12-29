import types from './types';
import { fetchLogin, fetchLogout } from './api';

const exception = error => {
  throw new Error(error);
};

const redirect = route => {
  window.location.href = route;
};


export const login = (data) => async dispatch => {
  dispatch(requestLogin());
  try {
    const req = await fetchLogin(data);
    dispatch(requestLoginSuccess(req.data))
  } catch (e) {
    dispatch(requestLoginError(e.message))
  }

};

const requestLogin = () => {
  return {
    type: types.LOGIN_REQUEST
  }
};

const requestLoginSuccess = (user) => {
  return {
    type: types.LOGIN_SUCCESS,
    payload: user
  }
};

const requestLoginError = (error) => {
  return {
    type: types.LOGIN_ERROR,
    payload: error
  }
};




// export const requestLogout = () => {
//   return async dispatch => {
//     const response = await HTTP.logout();
//
//     if (response.status === 200) {
//       return redirect('/');
//     }
//
//     if (response.status === 403) {
//       return redirect('/');
//     }
//
//     return exception('error');
//   };
// };


// export async function logout() {
//   return {
//     type: types.LOGIN_SUCCESS
//   }
// }

export const logout = () => async dispatch => {
  dispatch(requestLogout());
  try {
    const req = await fetchLogout();
    dispatch(requestLogoutSuccess(req.data))
  } catch (e) {
    dispatch(requestLogoutError(e.message))
  }

};

const requestLogout = () => {
  return {
    type: types.LOGOUT_REQUEST
  }
};

const requestLogoutSuccess = (user) => {
  redirect('/');
  return {
    type: types.LOGOUT_SUCCESS,
    payload: user
  }
};

const requestLogoutError = (error) => {
  return {
    type: types.LOGOUT_ERROR,
    payload: error
  }
};

export default {
  login,
  logout,
};