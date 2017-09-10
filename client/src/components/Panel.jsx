import React from 'react';
import { connect } from 'react-redux';
import { getPanelsByBoard, getTicketsByPanel, toggleEditPanel } from '../redux/actionCreators.js';
import { Modal, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import DatePicker from 'material-ui/DatePicker';
import Ticket from './Ticket.jsx';
import { Panel as BootstrapPanel } from 'react-bootstrap';

const Panel = props => {
  return (
    <BootstrapPanel header="Sprint X">
      <Button bsStyle="primary" onClick={props.handleEditPanelRendered}>Edit Panel</Button>
      <ListGroup fill>
        <ListGroupItem>Ticket 1 goes here</ListGroupItem>
        <ListGroupItem>Ticket 2 goes here</ListGroupItem>
        <ListGroupItem>Ticket 3 goes here</ListGroupItem>
        <ListGroupItem>Ticket 4 goes here</ListGroupItem>
        <ListGroupItem>Ticket 5 goes here</ListGroupItem>
        <ListGroupItem><Ticket/></ListGroupItem>
      </ListGroup>
    </BootstrapPanel>
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
    },
    handleEditPanelRendered() {
      dispatch(toggleEditPanel());
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