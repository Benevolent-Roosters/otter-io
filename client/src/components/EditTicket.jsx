import React from 'react';
import { connect } from 'react-redux';
import { putEditedTicket, editTickets, editCurrentTicket } from '../redux/actionCreators.js';
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
    handleEditCurrentTicket(event) {
      dispatch(editCurrentTicket(/**ticketObj from event **/));
    },

    handleEditTickets(tickets) {
      dispatch(editTickets(tickets));
    }
  };
};

export var UnwrappedEditTicket = EditTicket;
export default connect(mapStateToProps, mapDispatchToProps)(EditTicket);