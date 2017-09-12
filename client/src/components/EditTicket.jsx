import React from 'react';
import { connect } from 'react-redux';
import { putEditedTicket, handleSetTickets, editCurrentTicket, toggleEditTicket, getTicketsByPanel, editTicket, emptyTickets } from '../redux/actionCreators.js';
import { Modal, Form, FormGroup, FormControl, Button, ControlLabel, Grid, Col, Row, DropdownButton, MenuItem, ButtonToolbar } from 'react-bootstrap';
import axios from 'axios';

let buttonStyle = {marginTop: '15px', marginRight: '15px'};
let dropDownStyle = {marginTop: '15px'};

class EditTicket extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.currentTicket.title,
      description: this.props.currentTicket.description,
      status: this.props.currentTicket.status,
      priority: this.props.currentTicket.priority,
      type: this.props.currentTicket.type,
      panel_id: this.props.currentPanel.id,
      panel_name: this.props.currentPanel.name,
      assignee_handle: this.props.userHandle
    };
  }

  handleTitleChange(event) {
    this.setState({
      title: event.target.value
    });
  }

  handleDescriptionChange(event) {
    this.setState({
      description: event.target.value
    });
  }

  handleSelectAssignee(eventKey) {
    this.setState({
      assignee_handle: eventKey.currentTarget.textContent
    });
  }

  handleSelectType(eventKey) {
    this.setState({
      type: eventKey.currentTarget.textContent
    });
  }

  handleSelectPriority(eventKey) {
    this.setState({
      priority: eventKey.currentTarget.textContent
    });
  }

  handleSelectStatus(eventKey) {
    this.setState({
      status: eventKey.currentTarget.textContent
    });
  }

  handleSelectPanel(eventKey) {
    this.setState({
      panel_name: eventKey.currentTarget.textContent,
      panel_id: eventKey.currentTarget.id
    });
  }

  /** ON EDIT, PERFORM GET REQUEST FOR ALL PANELS IN BOARD TO RE-RENDER TICKETS IN CORRECT PLACES (IN CASED TICKET WAS MOVED FROM ONE PANEL TO ANOTHER) **/
  handleOnEdit() {
    // let currentTicket = Object.assign({}, this.state, {creator_id: this.props.userId, board_id: this.props.currentBoardId});
    // delete currentTicket.panel_name;
    // for (var i = 0; i < this.props.tickets.length; i++) {
      //   if (currentTicket.id === this.props.tickets[i].id) {
      //     this.props.handleEditTicket(i, currentTicket);
      //   }
      // }

    if (this.props.panels.length > 0) {
      this.props.handleEmptyTickets();
      for (let panel of this.props.panels) {
        this.props.handleSetTickets(panel.id);
      }
    }
  }

  render() {
    /*NOTE: Once we hook everything together, MenuItem will be created by mapping over the store's users, ticket types, ticket priorities, and store's panels */

    
    return (
      <div>
        <Grid>
          <Col sm={12}>
            <Row>
              <Modal show={this.props.editTicketRendered}>
                <Modal.Header bsSize='large' style={{backgroundColor: '#7ED321'}}>
                  <Modal.Title style={{color: 'white'}}>Edit Ticket</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <Form horizontal>
                          <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>Ticket Title</Col>
                            <Col sm={8}>
                            <FormControl name='Ticket Title' bsSize="large" type="text" placeholder={this.props.currentTicket.title} onChange={this.handleTitleChange.bind(this)}></FormControl>
                            </Col>
                          </FormGroup>
                          <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>Ticket Description</Col>
                            <Col sm={8}>
                            <FormControl name='Ticket Description' componentClass="textarea" bsSize="large" placeholder={this.props.currentTicket.description} onChange={this.handleDescriptionChange.bind(this)}></FormControl>
                            </Col>
                          </FormGroup>
                      <ButtonToolbar>
                      <DropdownButton title={this.state.assignee_handle ? this.state.assignee_handle : this.props.currentTicket.assignee_handle} pullRight id="split-button-pull-right">
                        <MenuItem eventKey="1" onClick={this.handleSelectAssignee.bind(this)}>{this.props.currentTicket.assignee_handle}</MenuItem>
                      </DropdownButton>
                      
                      <DropdownButton title={this.state.type ? this.state.type : this.props.currentTicket.type} pullRight id="split-button-pull-right">
                        <MenuItem eventKey="1" onClick={this.handleSelectType.bind(this)}>{'bug'}</MenuItem>
                        <MenuItem eventKey="2" onClick={this.handleSelectType.bind(this)}>{'feature'}</MenuItem>
                        <MenuItem eventKey="3" onClick={this.handleSelectType.bind(this)}>{'devops'}</MenuItem>
                      </DropdownButton>

                      <DropdownButton title={this.state.priority ? this.state.priority : this.props.currentTicket.priority} pullRight id="split-button-pull-right">
                        <MenuItem eventKey="1" onClick={this.handleSelectPriority.bind(this)}>{1}</MenuItem>
                        <MenuItem eventKey="2" onClick={this.handleSelectPriority.bind(this)}>{2}</MenuItem>
                        <MenuItem eventKey="3" onClick={this.handleSelectPriority.bind(this)}>{3}</MenuItem>
                      </DropdownButton>

                      <DropdownButton title={this.state.status ? this.state.status : this.props.currentTicket.status} pullRight id="split-button-pull-right">
                          <MenuItem eventKey="1" onClick={this.handleSelectStatus.bind(this)}>{'not started'}</MenuItem>
                          <MenuItem eventKey="2" onClick={this.handleSelectStatus.bind(this)}>{'in progress'}</MenuItem>
                          <MenuItem eventKey="3" onClick={this.handleSelectStatus.bind(this)}>{'complete'}</MenuItem>
                        </DropdownButton>
                      
                      <DropdownButton title={this.state.panel_name ? this.state.panel_name : this.props.currentPanel.name} pullRight id="split-button-pull-right">
                      {this.props.panels.map(panel => <MenuItem id={panel.id} eventKey={panel.id} onClick={this.handleSelectPanel.bind(this)}> {panel.name} </MenuItem>)}
                    </DropdownButton>
                    
                    </ButtonToolbar>
                    <Button style={buttonStyle} bsStyle="default" onClick={this.props.handleEditTicketRendered}>Cancel</Button>
                    <Button style={buttonStyle} bsStyle="primary" type="button" onClick={() => 
                      {let { panel_name, ...editedTicket} = this.state; 
                      console.log('HELLO', editedTicket); 
                      this.props.handleEditCurrentTicket(Object.assign({}, editedTicket, {creator_id:
                        this.props.userId, board_id: this.props.currentBoardId, id: this.props.currentTicket.id})); this.handleOnEdit();
                      this.props.handleEditTicketRendered();}}>Update</Button>
                    </Form>
                  </Modal.Body>
                </Modal>
                </Row>
              </Col>
            </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.user.id,
    userHandle: state.user.github_handle, //double check what userid key actually is named
    currentBoardId: state.currentBoard.id, //double check what userid key actually is named,
    currentPanel: state.currentPanel,
    panels: state.panels,
    tickets: state.tickets,
    editTicketRendered: state.editTicketRendered,
    currentTicket: state.currentTicket
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleEditCurrentTicket(ticketObj) {
      dispatch(putEditedTicket(ticketObj));
    },
    handleEditTicketRendered() {
      dispatch(toggleEditTicket());
    },
    handleSetTickets(panelId) {
      dispatch(getTicketsByPanel(panelId));
    },
    handleEditTicket(index, ticket) {
      dispatch(editTicket(index, ticket));
    },
    handleEmptyTickets() {
      dispatch(emptyTickets());
    }
  };
};

export var UnwrappedEditTicket = EditTicket;
export default connect(mapStateToProps, mapDispatchToProps)(EditTicket);