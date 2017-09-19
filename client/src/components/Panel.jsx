import React from 'react';
import { connect } from 'react-redux';
import { getPanelsByBoard, getTicketsByPanel, toggleEditPanel, toggleCreateTicket, setCurrentPanel } from '../redux/actionCreators.js';
import { Modal, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import DatePicker from 'material-ui/DatePicker';
import Ticket from './Ticket.jsx';
import { Panel as BootstrapPanel, NavItem } from 'react-bootstrap';

const Panel = props => {

  /** PANEL HEADER STYLING AND INFO **/
  const panelHeader = (
    <div className="panelHeader">
      <div>
        <div>{props.panelInfo.name}</div>
        <h6 style={{fontStyle: 'italic', marginTop: '0px', marginBottom: '0px'}}> COMPLETE BY: {props.panelInfo.due_date.slice(0, 10)}</h6>
      </div>
        <NavItem eventKey={1} onClick={() => {
          props.handleSetCurrentPanel(props.panelInfo);
          props.handleEditPanelRendered();}}>
          Edit
        </NavItem> 
    </div>
  );

  return (
    <BootstrapPanel
    className="sprint-panel"
    header={panelHeader}>
      <Button style={{marginBottom: '15px'}} bsStyle="primary" bsSize="large" onClick={() => {
              props.handleSetCurrentPanel(props.panelInfo);
              props.handleCreateTicketRendered(); 
              }} block>Add a Ticket</Button>
      {props.tickets.map(ticket =>
        ticket.panel_id === props.panelInfo.id ? <Ticket panelInfo={props.panelInfo} ticketInfo={ticket} /> : ''
      )}
    </BootstrapPanel>
  );
};

const mapStateToProps = (state) => {
  return {
    'currentBoardId': state.rootReducer.currentBoard.boardid,
    'currentPanel': state.rootReducer.currentPanel,
    'tickets': state.rootReducer.tickets,
    'createTicketRendered': state.rootReducer.createTicketRendered
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleGetPanelsByBoard(panels) {
      dispatch(getPanelsByBoard(panels));
    },
    handleGetTicketsByPanel(panelId) {
      dispatch(getTicketsByPanel(panelId));
    },
    handleSetCurrentPanel(panel) {
      dispatch(setCurrentPanel(panel));
    },
    handleEditPanelRendered() {
      dispatch(toggleEditPanel());
    },
    handleCreateTicketRendered() {
      dispatch(toggleCreateTicket());
    }
  };
};  

export var UnwrappedPanel = Panel;
export default connect(mapStateToProps, mapDispatchToProps)(Panel);
