import React from 'react';
import { connect } from 'react-redux';
import { toggleDrawer } from '../redux/actionCreators.js';
import { Button } from 'react-bootstrap';

const PerformanceDashboard = (props) => {

  let ticketCount = 0;
  let ticketsCompleted = 0;
  let ticketsIncomplete = 0;

  return (

    <div>
      <div className="sidebar-nav-button">
        <Button><img src={require('../images/menu.png')} onClick={props.handleToggleDrawer}/></Button>
      </div>

      <div className="performance-dashboard">

        <div className="white-border"></div>

        <div className="created-tickets">
          <div className="number">
            {props.tickets.map(ticket => {
              ticket.panel_id === props.currentPanel.id ? ticketCount++ : '';
            })}
            {ticketCount}
          </div>

          <div className="stat-type">Tickets Created</div>
        </div>

        <div className="grey-border"></div>

        <div className="closed-tickets">
          <div className="number">
            {props.tickets.map(ticket => {
              (ticket.panel_id === props.currentPanel.id && ticket.status === 'complete') ? ticketsCompleted++ : '';
            })}
            {ticketsCompleted}
          </div>

          <div className="stat-type">Closed Tickets</div>
        </div>

        <div className="grey-border"></div>

        <div className="remaining-tickets">
          <div className="number">
            {props.tickets.map(ticket => {
              (ticket.panel_id === props.currentPanel.id && ticket.status !== 'complete') ? ticketsIncomplete++ : '';
            })}
            {ticketsIncomplete}
          </div>

          <div className="stat-type">Remaining Tickets</div>
        </div>

        <div className="white-border"></div>

      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentPanel: state.rootReducer.currentPanel,
    tickets: state.rootReducer.tickets
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleToggleDrawer() {
      dispatch(toggleDrawer());
    }
  };
};

export var UnwarppedPerformanceDashboard = PerformanceDashboard;
export default connect(mapStateToProps, mapDispatchToProps)(PerformanceDashboard);