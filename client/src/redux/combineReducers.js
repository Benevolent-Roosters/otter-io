import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import rootReducer from './reducers.js';

export default combineReducers({
  routing: routerReducer,
  rootReducer
})