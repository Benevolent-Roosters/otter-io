import React from 'react';
import { connect } from 'react-redux';
import { getUserInfo, getBoardsByUser } from '../redux/actionCreators.js';
import axios from 'axios';
import moment from 'moment';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentWillMount() {
    this.props.handleGetUser()
      .then(user => {
        return this.props.handleSetBoards(user.github_handle);
      })

      .then (boards => {
        return this.props.handleSetPanels(boards[0].board_id);
      })

      .then(panels => {
        for (let panel of panels) {
          this.props.handleSetTickets(panel.id);
        }
        let closestIndex = this.findCurrentPanel(panels);
        this.props.handleSetCurrentPanel(panels[closestIndex]);    
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

  orderTickets(tickets) {
    // let newOrdered = [];
    // for (let ticket of tickets) {
    //   if ()
    // }
  }

  render() {
    return (
      <div>HELLO</div>
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
    currentPanel: state.currentPanel
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleGetUser() {
      dispatch(getUserInfo());
    },
    handleSetBoards(userGithubHandle) {
      dispatch(getBoardsByUser(userGithubHandle));
    },
    handleSetPanels(boardid) {
      dispatch(getPanelsByBoard(boardid));
    },
    handleSetCurrentPanel(panel) {
      dispatch(setCurrentPanel(panel));
    },
    handleSetTickets(tickets) {
      dispatch(setTickets(tickets));
    }
  };
};

export var UnwrappedApp = App;
export default connect(mapStateToProps, mapDispatchToProps)(App);