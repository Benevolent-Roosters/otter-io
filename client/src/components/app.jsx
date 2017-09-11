import React from 'react';
import { connect } from 'react-redux';
import { getUserInfo, getBoardsByUser, toggleDrawer, toggleCreateBoard, toggleEditBoard, toggleCreateTicket, toggleEditTicket, toggleCreatePanel } from '../redux/actionCreators.js';

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
  
  // componentWillMount() {
  //   this.props.handleGetUser()
  //     .then(user => {
  //       return this.props.handleSetBoards();
  //     })

  //     .then (boards => {
  //       return this.props.handleSetPanels(boards[0].id);
  //     })

  //     .then(panels => {
  //       for (let panel of panels) {
  //         this.props.handleSetTickets(panel.id);
  //       }
  //       let closestIndex = this.findCurrentPanel(panels);
  //       this.props.handleSetCurrentPanel(panels[closestIndex]);    
  //     });
  // }

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
        <Button bsStyle="primary" onClick={this.props.handleEditBoardRendered}>Edit Board</Button>
        <Button bsStyle="primary" onClick={this.props.handleCreateTicketRendered}>Create Ticket</Button>
        <Button bsStyle="primary" onClick={this.props.handleEditTicketRendered}>Edit Ticket</Button>
        <Button bsStyle="primary" onClick={this.props.handleCreatePanelRendered}>Create Panel</Button>
        <Button style={iconStyle}><img src={require('../images/menu.png')} onClick={this.props.handleToggleDrawer}/></Button>
        <SidebarNavigation/>
        <PerformanceDashboard/>
        <Board/>
        <CreateBoard/>
        <EditBoard/>
        <CreateTicket/>
        <EditTicket/>
        <CreatePanel/>
        <EditPanel/>
      </div>
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
    handleGetUser() {
      dispatch(getUserInfo());
    },
    handleSetBoards() {
      dispatch(getBoardsByUser());
    },
    handleSetPanels(boardid) {
      dispatch(getPanelsByBoard(boardid));
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