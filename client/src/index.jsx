import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';

import { ConnectedRouter } from 'react-router-redux';

import App from './components/app.jsx';

import store, { history } from './redux/store.js';

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
