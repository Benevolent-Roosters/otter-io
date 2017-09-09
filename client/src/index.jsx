
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import store from './redux/store.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';

ReactDOM.render(<Provider store={store}><MuiThemeProvider><App /></MuiThemeProvider></Provider>, document.getElementById('root'));
