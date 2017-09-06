import React from 'react';
import { connect } from 'react-redux';
import { getUserInfo, getBoardsByUser } from '../redux/actionCreators.js';
import axios from 'axios';


class App extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentWillMount() {
    this.props.handleGetUser()
      .then(response => {
        return this.props.handleSetBoards(response.github_handle);
      })

      .then (response => {
        this.props.handleSetPanels(response[0].board_id);
      });
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
    currentBoard: state.currentBoard
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
    }
  };
};

export var UnwrappedApp = App;
export default connect(mapStateToProps, mapDispatchToProps)(App);