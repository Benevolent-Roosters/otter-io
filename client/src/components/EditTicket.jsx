import React from 'react';
import { connect } from 'react-redux';
import { getTicketsByPanel } from '../redux/actionCreators.js';
import axios from 'axios';


const EditTicket = props => {
  return (
    <div>In EditTicket</div>
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
    handleEditTickets(newTickets, boardid, panelid, userid) {
      dispatch(editTicket(newTicket, boardid, panelid, userid));
    }
  };
};

export var UnwrappedEditTicket = EditTicket;
export default connect(mapStateToProps, mapDispatchToProps)(EditTicket);