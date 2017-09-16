import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';

import { ConnectedRouter } from 'react-router-redux';

import MainRouter from './components/MainRouter.jsx';
import App from './components/App.jsx';
import store, { history } from './redux/store.js';
import rootReducer from './redux/reducers.js';

ReactDOM.render(

  <Provider store={store}>
    <ConnectedRouter history = {history}>
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')

);
