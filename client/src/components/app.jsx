import React from 'react';
import { connect } from 'react-redux';
import { getUserInfo, getBoardsByUser, getPanelsByBoard, getTicketsByPanel, setCurrentPanel, setCurrentBoard, toggleDrawer, toggleCreateBoard, toggleEditBoard, toggleCreateTicket, toggleEditTicket, toggleCreatePanel } from '../redux/actionCreators.js';

import axios from 'axios';
import moment from 'moment';
import CreatePanel from './CreatePanel.jsx';
import Board from './Board.jsx';
import SidebarNavigation from './SidebarNav.jsx';
import PerformanceDashboard from './PerformanceDashboard.jsx';
import Panel from './Panel.jsx';
import CreateBoard from './CreateBoard.jsx';
import EditBoard from './EditBoard.jsx';
import CreateTicket from './CreateTicket.jsx';
import EditTicket from './EditTicket.jsx';
import { Button } from 'react-bootstrap';
import EditPanel from './EditPanel.jsx';

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
          for (let panel of panels) {
            context.props.handleSetTickets(panel.id);
          }
          let closestIndex = context.findCurrentPanel(panels);
          context.props.handleSetCurrentPanel(panels[closestIndex]);    
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
    let boardStyle = {
      width: '100%',
      height: '750px',

    }
    return (
      <div>
      <div>
        <Button bsStyle="primary" onClick={this.props.handleEditBoardRendered}>Edit Board</Button>
        <Button bsStyle="primary" onClick={this.props.handleCreateTicketRendered}>Create Ticket</Button>
        <Button bsStyle="primary" onClick={this.props.handleEditTicketRendered}>Edit Ticket</Button>
        <Button bsStyle="primary" onClick={this.props.handleCreatePanelRendered}>Create Panel</Button>
        <Button style={iconStyle}><img src={require('../images/menu.png')} onClick={this.props.handleToggleDrawer}/></Button>
        <SidebarNavigation/>
        <PerformanceDashboard/>
        <CreateBoard/>
        <EditBoard/>
        <CreateTicket/>
        <EditTicket/>
        <CreatePanel/>
        <EditPanel/>
      </div>
        <div style={{width: window.innerWidth - 100 }}><Board style={boardStyle}/></div></div>
    );
  } 
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    boards: state.boards,
    panels: state.panels,
    tickets: state.tickets,
    currentBoard: state.currentBoard,
    currentPanel: state.currentPanel,
    createBoardRendered: state.createBoardRendered,
    editBoardRendered: state.editBoardRendered,
    createTicketRendered: state.createTicketRendered,
    editTicketRendered: state.editTicketRendered,
    createPanelRendered: state.createPanelRendered
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
    handleEditBoardRendered() {
      dispatch(toggleEditBoard());
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