import React from 'react';
import { connect } from 'react-redux';
import { getTicketsByPanel } from '../redux/actionCreators.js';

const Ticket = props => {
  return (
    <div>In Tickets</div>
  );
};

//NOTE: most likely NOT necessary if upon entering new board we navigate to new route, because navigating to new route will re-render app (we think).
const mapStateToProps = (state) => {
  return {
    'currentTicket': state.currentTicket
  };
};

export var UnwrappedTicket = Ticket;
export default connect(mapStateToProps)(Ticket);