import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import Board from './Board.jsx';
import MainRouter from './MainRouter.jsx';
import SidebarNavigation from './SidebarNav.jsx';
import { getUserInfo, getBoardsByUser, getPanelsByBoard, getTicketsByPanel, setCurrentPanel, setCurrentBoard, toggleDrawer, toggleCreateBoard, toggleEditBoard, toggleCreateTicket, toggleEditTicket, toggleCreatePanel } from '../redux/actionCreators.js';

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
    let futureDueDates = [];
    dueDates.forEach(date => {if (moment().diff(date) < 0) {futureDueDates.push(date);}});
    let closest = 0;
    for (let i = 0; i < futureDueDates.length; i++) {
      if (futureDueDates[i]) {
        if ((moment().diff(futureDueDates[i]) > moment().diff(futureDueDates[closest]))) {
          closest = i;
        }
      }
    }
    return dueDates.indexOf(futureDueDates[closest]);
  }

  render() {
    return (
      <div>
          <SidebarNavigation/>
          <MainRouter />
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