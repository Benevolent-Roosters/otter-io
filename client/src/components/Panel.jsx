import React from 'react';
import { getPanelsByBoard, getTicketsByPanel } from '../redux/actionCreators.js';

const Panel = props => {
  let finalTickets = [];
  for (let ticket of this.props.tickets) {
    if (ticket.status === 'complete') {
      finalTickets.unshift(ticket);
    }
  }
  for (let ticket of this.props.tickets) {
    if (ticket.status === 'not started') {
      finalTickets.unshift(ticket);
    }
  }
  for (let ticket of this.props.tickets) {
    if (ticket.status === 'in progress') {
      finalTickets.unshift(ticket);
    }
  }
  for (let ticket of this.props.tickets) {
    if (ticket.priority === 3) {
      finalTickets.unshift(ticket);
    }
  }
  for (let ticket of this.props.tickets) {
    if (ticket.priority === 2) {
      finalTickets.unshift(ticket);
    }
  }
  for (let ticket of this.props.tickets) {
    if (ticket.priority === 1) {
      finalTickets.unshift(ticket);
    }
  }
  return (
    <div>In Panels</div>
  );
};

//NOTE: most likely NOT necessary if upon entering new board we navigate to new route, because navigating to new route will re-render app (we think).
const mapStateToProps = (state) => {
  return {
    'currentBoardId': state.currentBoard.boardid,
    'currentPanel': state.currentPanel,
    'tickets': state.tickets
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleGetPanelsByBoard(panels) {
      dispatch(getPanelsByBoard(panels));
    },
    handleGetTicketsByPanel(panelId) {
      dispatch(getTicketsByPanel(panelId));
    }
  };
};

export var UnwrappedPanel = Panel;
export default connect(mapStateToProps, mapDispatchToProps)(Panel);