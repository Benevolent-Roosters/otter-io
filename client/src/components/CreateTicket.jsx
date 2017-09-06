import React from 'react';
import { connect } from 'react-redux';
import { getTicketsByPanel } from '../redux/actionCreators.js';
import axios from 'axios';


const CreateTicket = props => {
  return (
    <div>In CreateTicket</div>
  );
};

const mapStateToProps = state => {
  return {
    userId: state.user.userid, //double check what userid key actually is named
    currentBoardId: state.currentBoard.boardid, //double check what userid key actually is named,
    panels: state.panels
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleSetTickets(newTickets, boardid, panelid, userid) {
      dispatch(postCreatedTicket(newTicket, boardid, panelid, userid));
    }
  };
};

export var UnwrappedCreatePanel = CreatePanel;
export default connect(mapStateToProps, mapDispatchToProps)(CreatePanel);