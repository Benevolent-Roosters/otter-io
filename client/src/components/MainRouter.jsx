import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';

import App from './app.jsx';
import Board from './Board.jsx';

var Main = (props) => (
  <div id='routes'>
    <Switch>
      <Route path='boards/:id' component={Board}/>
    </Switch>
 </div> 
)

export default Main;