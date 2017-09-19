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

//NOTE: most likely NOT necessary if upon entering new board we navigate to new route, because navigating to new route will re-render app (we think).
const mapStateToProps = (state) => {
  return {
    'currentBoardId': state.currentBoard.boardid,
    'currentPanel': state.currentPanel,
    'tickets': state.tickets,
    'createTicketRendered': state.createTicketRendered
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

// props.tickets.map((ticket) => {
//   return <Ticket/>
// })

    // <div>
    //   <Modal.Dialog bsSize="small" aria-labelledby="contained-modal-title-sm">
    //     <Modal.Header style={{backgroundColor: '#7ED321'}}>
    //       <Modal.Title style={{color: 'white'}}>
    //         <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: '20px'}}>
    //           <div>
    //             <h3>Sprint 3</h3>
    //             <DatePicker textFieldStyle= {{fontFamily: 'Avenir Next', color: 'white', fontSize: '20px'}} hintText={'Select a Due Date'} /**defaultDate={/**props.currentPanel.dueDate}**/></DatePicker>
    //           </div>
    //             <Button bsStyle="primary" style={{float: 'right'}} onClick={props.handleEditPanelRendered}>Edit Panel</Button>
    //         </div>
    //       </Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //       </Modal.Body>
    //   </Modal.Dialog>
    // </div>