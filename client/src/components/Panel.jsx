import React from 'react';
import { connect } from 'react-redux';
import { getPanelsByBoard } from '../redux/actionCreators.js';
import { Modal } from 'react-bootstrap';
import DatePicker from 'material-ui/DatePicker';
import Ticket from './Ticket.jsx';

const Panel = props => {
  return (
    <div>
      <Modal show={true} bsSize="small" aria-labelledby="contained-modal-title-sm">
        <Modal.Header style={{backgroundColor: '#7ED321'}}>
          <Modal.Title style={{color: 'white'}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: '20px'}}>
              <div>
                <h3>Sprint 3</h3>
                <DatePicker textFieldStyle= {{fontFamily: 'Avenir Next', color: 'white', fontSize: '20px'}} hintText={'Select a Due Date'} /**defaultDate={/**props.currentPanel.dueDate}**/></DatePicker>
              </div>
              <img style={{float: 'right'}} src={require('../images/calendar-interface-symbol-tool.png')}/>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          </Modal.Body>
      </Modal>
    </div>
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

// props.tickets.map((ticket) => {
//   return <Ticket/>
// })