import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import store from './redux/store.js';

import { Provider } from 'redux';

ReactDOM.render(<Provider store={store} ><App /></Provider>, document.getElementById('root'));
