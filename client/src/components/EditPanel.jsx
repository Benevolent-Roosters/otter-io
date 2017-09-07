import React from 'react';
import { connect } from 'react-redux';
import { postCreatedPanel } from '../redux/actionCreators.js';
import axios from 'axios';

const EditPanel = props => {
  return (
    <div>In EditPanel</div>
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
    handleEditPanel(newPanel, boardid, userid) {
      dispatch(editPanel(newPanel, boardid, userid));
    }
  };
};

export var UnwrappedEditPanel = EditPanel;
export default connect(mapStateToProps, mapDispatchToProps)(EditPanel);
