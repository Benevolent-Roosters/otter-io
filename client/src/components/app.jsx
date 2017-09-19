import React from 'react';
import { connect } from 'react-redux';
import { getUserInfo, getBoardsByUser, getPanelsByBoard, getTicketsByPanel, setCurrentPanel, setCurrentBoard, toggleDrawer, toggleCreateBoard, toggleEditBoard, toggleCreateTicket, toggleEditTicket, toggleCreatePanel } from '../redux/actionCreators.js';

import axios from 'axios';
import moment from 'moment';
import Board from './Board.jsx';
import SidebarNavigation from './SidebarNav.jsx';
import { Button } from 'react-bootstrap';
import MainRouter from './MainRouter.jsx';

let iconStyle = {
  position: 'absolute',
  top: '20px',
  left: '20px',
  backgroundColor: 'white'
};

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentWillMount() {
    var context = this;
    this.props.handleGetUser(function(userInfo) {
      context.props.handleSetBoards(function() {
        context.props.handleSetPanels(context.props.currentBoard.id, function(panels) {
          if (panels.length !== 0) {
            for (let panel of panels) {
              context.props.handleSetTickets(panel.id);
            }
            let closestIndex = context.findCurrentPanel(panels);
            context.props.handleSetCurrentPanel(panels[closestIndex]);    
          }
        });
      });
    });
  }

  findCurrentPanel(panels) {
    let dueDates = panels.map(panel => panel.due_date.slice(0, 10));
    let closest = 0;
    for (let i = 0; i < dueDates.length; i++) {
      if (moment().diff(dueDates[i]) < 0 && moment().diff(dueDates[i]) > moment().diff(dueDates[closest])) {
        closest = i;
      }
    }
    return closest;
  }

  render() {
    return (
      <div>
        <div>
          <Button style={iconStyle}><img src={require('../images/menu.png')} onClick={this.props.handleToggleDrawer}/></Button>
          <SidebarNavigation/>
          <MainRouter />
        </div>
      </div>
    );
  } 
}

const mapStateToProps = (state) => {
  return {
    user: state.rootReducer.user,
    boards: state.rootReducer.boards,
    panels: state.rootReducer.panels,
    tickets: state.rootReducer.tickets,
    currentBoard: state.rootReducer.currentBoard,
    currentPanel: state.rootReducer.currentPanel,
    createBoardRendered: state.rootReducer.createBoardRendered,
    editBoardRendered: state.rootReducer.editBoardRendered,
    createTicketRendered: state.rootReducer.createTicketRendered,
    editTicketRendered: state.rootReducer.editTicketRendered,
    createPanelRendered: state.rootReducer.createPanelRendered
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleGetUser(callback) {
      dispatch(getUserInfo(callback));
    },
    handleSetBoards(callback) {
      dispatch(getBoardsByUser(callback));
    },
    handleSetPanels(boardid, callback) {
      dispatch(getPanelsByBoard(boardid, callback));
    },
    handleSetTickets(panelId) {
      dispatch(getTicketsByPanel(panelId));
    },
    handleSetCurrentPanel(panel) {
      dispatch(setCurrentPanel(panel));
    },
    handleToggleDrawer() {
      dispatch(toggleDrawer());
    },
    handleCreateTicketRendered() {
      dispatch(toggleCreateTicket());
    },
    handleEditTicketRendered() {
      dispatch(toggleEditTicket());
    },
    handleCreatePanelRendered() {
      dispatch(toggleCreatePanel());
    }
  };
};

export var UnwrappedApp = App;
export default connect(mapStateToProps, mapDispatchToProps)(App); 