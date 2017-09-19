import React from 'react';
import { Route, Switch } from 'react-router-dom';

import App from './app.jsx';
import Board from './Board.jsx';


const boardStyle = {
  width: '100%',
  height: '750px'
}

const MainRouter = props => (
  <div id='routes'>
    <Switch>
      <Route exact path='/' render={(props) => (
        <div style={{width: window.innerWidth - 100 }}>
          <Board style={boardStyle}/>
        </div>
        )} />
      <Route path='/boards/:id' render={(props) => (
        <div style={{width: window.innerWidth - 100 }}>
          <Board style={boardStyle}/>
        </div>
        )} />
    </Switch>
 </div> 
)

export default MainRouter;