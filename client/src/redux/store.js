import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import combinedReducers from './combineReducers.js';

export const history = createHistory();

const initialState = {};
const enhancers = [];
const middleware  =[
  thunk,
  routerMiddleware(history)
];


if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  combinedReducers,
  initialState,
  composedEnhancers
);

export default store;