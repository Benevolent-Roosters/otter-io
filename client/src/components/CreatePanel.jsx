import React from 'react';
import { connect } from 'react-redux';
import { postCreatedPanel } from '../redux/actionCreators.js';
import axios from 'axios';

const CreatePanel = props => {
  return (
    <div>In CreatePanel</div>
  );
};

const mapStateToProps = state => {
  return {
    userId: state.user.userid, //double check what userid key actually is named
    currentBoardId: state.currentBoard.boardid //double check what userid key actually is named
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleSetPanels(newPanel, boardid, userid) {
      dispatch(postCreatedPanel(newPanel, boardid, userid));
    }
  };
};

export var UnwrappedCreatePanel = CreatePanel;
export default connect(mapStateToProps, mapDispatchToProps)(CreatePanel);
