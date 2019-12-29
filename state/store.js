import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import * as reducers from './modules';

const INITIAL_STATE = {};

export default function configureStore(initialState = INITIAL_STATE, history) {

  const rootReducer = combineReducers({
    ...reducers,
  });

  // const customMiddleWare = store => next => action => {
  // };

  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  )
}