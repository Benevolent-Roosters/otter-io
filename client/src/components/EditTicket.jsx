import React from 'react';
import { connect } from 'react-redux';
import { putEditedTicket, handleSetTickets, editCurrentTicket, toggleEditTicket, getTicketsByPanel, editTicket, emptyTickets } from '../redux/actionCreators.js';
import { Modal, Form, FormGroup, FormControl, Button, ControlLabel, Grid, Col, Row, DropdownButton, MenuItem, ButtonToolbar } from 'react-bootstrap';
import axios from 'axios';

const buttonStyle = {marginTop: '15px', marginRight: '15px'};
const dropDownStyle = {marginTop: '15px'};

class EditTicket extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.currentTicket.title,
      description: '',
      status: '',
      priority: 0,
      type: '',
      assignee_handle: this.props.userHandle,
      panel_id: this.props.currentPanel.id,
      panel_name: this.props.currentPanel.name,
      board_id: this.props.currentBoard.id,
      members: this.props.currentBoard.members
    };
    this.baseState = this.state;
  }

  handleTitleChange(event) {
    this.setState({
      title: event.target.value,
      description: this.state.description || this.props.currentTicket.description,
      status: this.state.status || this.props.currentTicket.status,
      priority: this.state.priority || this.props.currentTicket.priority,
      type: this.state.type || this.props.currentTicket.type,
      assignee_handle: this.state.assignee_handle || this.props.userHandle,
      panel_id: this.state.panel_id || this.props.currentPanel.id,
      panel_name: this.state.panel_name || this.props.currentPanel.name,
      board_id: this.state.board_id || this.props.currentBoard.id,
      members: this.state.members || this.props.currentBoard.members
    });
  }

  handleDescriptionChange(event) {
    this.setState({
      title: this.state.title || this.props.currentTicket.title,
      description: event.target.value,
      status: this.state.status || this.props.currentTicket.status,
      priority: this.state.priority || this.props.currentTicket.priority,
      type: this.state.type || this.props.currentTicket.type,
      assignee_handle: this.state.assignee_handle || this.props.userHandle,
      panel_id: this.state.panel_id || this.props.currentPanel.id,
      panel_name: this.state.panel_name || this.props.currentPanel.name,
      board_id: this.state.board_id || this.props.currentBoard.id,
      members: this.state.members || this.props.currentBoard.members
    });
  }

  handleSelectAssignee(eventKey) {
    this.setState({
      title: this.state.title || this.props.currentTicket.title,
      description: this.state.description || this.props.currentTicket.description,
      status: this.state.status || this.props.currentTicket.status,
      priority: this.state.priority || this.props.currentTicket.priority,
      type: this.state.type || this.props.currentTicket.type,
      assignee_handle: eventKey.currentTarget.textContent.trim(),
      panel_id: this.state.panel_id || this.props.currentPanel.id,
      panel_name: this.state.panel_name || this.props.currentPanel.name,
      board_id: this.state.board_id || this.props.currentBoard.id,
      members: this.state.members || this.props.currentBoard.members
    });
  }

  handleSelectType(eventKey) {
    this.setState({
      title: this.state.title || this.props.currentTicket.title,
      description: this.state.description || this.props.currentTicket.description,
      status: this.state.status || this.props.currentTicket.status,
      priority: this.state.priority || this.props.currentTicket.priority,
      type: eventKey.currentTarget.textContent,
      assignee_handle: this.state.assignee_handle || this.props.userHandle,
      panel_id: this.state.panel_id || this.props.currentPanel.id,
      panel_name: this.state.panel_name || this.props.currentPanel.name,
      board_id: this.state.board_id || this.props.currentBoard.id,
      members: this.state.members || this.props.currentBoard.members
    });
  }

  handleSelectPriority(eventKey) {
    this.setState({
      title: this.state.title || this.props.currentTicket.title,
      description: this.state.description || this.props.currentTicket.description,
      status: this.state.status || this.props.currentTicket.status,
      priority: eventKey.currentTarget.textContent,
      type: this.state.type || this.props.currentTicket.type,
      assignee_handle: this.state.assignee_handle || this.props.userHandle,
      panel_id: this.state.panel_id || this.props.currentPanel.id,
      panel_name: this.state.panel_name || this.props.currentPanel.name,
      board_id: this.state.board_id || this.props.currentBoard.id,
      members: this.state.members || this.props.currentBoard.members
    });
  }

  handleSelectStatus(eventKey) {
    this.setState({
      title: this.state.title || this.props.currentTicket.title,
      description: this.state.description || this.props.currentTicket.description,
      status: eventKey.currentTarget.textContent,
      priority: this.state.priority || this.props.currentTicket.priority,
      type: this.state.type || this.props.currentTicket.type,
      assignee_handle: this.state.assignee_handle || this.props.userHandle,
      panel_id: this.state.panel_id || this.props.currentPanel.id,
      panel_name: this.state.panel_name || this.props.currentPanel.name,
      board_id: this.state.board_id || this.props.currentBoard.id,
      members: this.state.members || this.props.currentBoard.members
    });
  }

  handleSelectPanel(eventKey) {
    this.setState({
      title: this.state.title || this.props.currentTicket.title,
      description: this.state.description || this.props.currentTicket.description,
      status: this.state.status || this.props.currentTicket.status,
      priority: this.state.priority || this.props.currentTicket.priority,
      type: this.state.type || this.props.currentTicket.type,
      assignee_handle: this.state.assignee_handle || this.props.userHandle,
      panel_name: eventKey.currentTarget.textContent,
      panel_id: eventKey.currentTarget.id,
      board_id: this.state.board_id || this.props.currentBoard.id,
      members: this.state.members || this.props.currentBoard.members
    });
  }

  /** ON EDIT, PERFORM GET REQUEST FOR ALL PANELS IN BOARD TO RE-RENDER TICKETS IN CORRECT PLACES (IN CASED TICKET WAS MOVED FROM ONE PANEL TO ANOTHER) **/
  handleOnEdit() {
    if (this.props.panels.length > 0) {
      this.props.handleEmptyTickets();
      for (let panel of this.props.panels) {
        this.props.handleSetTickets(panel.id);
      }
    }
  }

  // checkPriorityState() {
  //   if (this.state.priority) {
  //     if (this.state.priority === 1) {
  //       return 'Low';
  //     } else if (this.state.priority === 2) {
  //       return 'Medium';
  //     } else {
  //       return 'High';
  //     }
  //   } else {
  //     return;
  //   }
  // }

  // checkPropsPriorityState() {
  //   if (this.props.currentTicket.priority) {
  //     if (this.props.currentTicket.priority === 1) {
  //       return 'Low';
  //     } else if (this.props.currentTicket.priority === 2) {
  //       return 'Medium';
  //     } else {
  //       return 'High';
  //     }
  //   } else {
  //     return;
  //   }
  // }

  resetForm() {
    this.setState(this.baseState);
  }


  render() {
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
                              <Col componentClass={ControlLabel} sm={2}>Title: </Col>
                              <Col sm={8}>
                              <FormControl name='Ticket Title' bsSize="large" type="text" placeholder={this.props.currentTicket.title} defaultValue={this.props.currentTicket.title} onChange={this.handleTitleChange.bind(this)}></FormControl>
                              </Col>
                            </FormGroup>
                            
                            <FormGroup>
                              <Col componentClass={ControlLabel} sm={2}>Description: </Col>
                              <Col sm={8}>
                              <FormControl name='Ticket Description' componentClass="textarea" bsSize="large" placeholder={this.props.currentTicket.description} defaultValue={this.props.currentTicket.description} onChange={this.handleDescriptionChange.bind(this)}></FormControl>
                              </Col>
                            </FormGroup>
                            
                            <div className="edit-ticket">
                              <div className="select-assignee">
                                <Col componentClass={ControlLabel} sm={2}>Assignee: </Col>
                                <DropdownButton title={this.state.assignee_handle ? this.state.assignee_handle : this.props.currentTicket.assignee_handle} pullRight id="split-button-pull-right">
                                {this.props.currentBoard.members ? this.props.currentBoard.members.map(member => {
                                  return <MenuItem eventKey="1" onClick={this.handleSelectAssignee.bind(this)}> {member.github_handle} </MenuItem>;
                                }) : ''}
                                </DropdownButton>
                                </div>
                            
                              <div className="select-type">
                              <Col componentClass={ControlLabel} sm={2}>Type: </Col>
                              <DropdownButton title={this.state.type ? this.state.type : this.props.currentTicket.type} pullRight id="split-button-pull-right">
                                <MenuItem eventKey="1" onClick={this.handleSelectType.bind(this)}>{'bug'}</MenuItem>
                                <MenuItem eventKey="2" onClick={this.handleSelectType.bind(this)}>{'feature'}</MenuItem>
                                <MenuItem eventKey="3" onClick={this.handleSelectType.bind(this)}>{'devops'}</MenuItem>
                              </DropdownButton>
                                </div>

                              <div className="select-priority">
                              <Col componentClass={ControlLabel} sm={2}>Priority: </Col>
                              <DropdownButton title={this.state.priority ? this.state.priority : this.props.currentTicket.priority} pullRight id="split-button-pull-right">
                                <MenuItem eventKey="1" id={1} onClick={this.handleSelectPriority.bind(this)}>{1}</MenuItem>
                                <MenuItem eventKey="2" id={2} onClick={this.handleSelectPriority.bind(this)}>{2}</MenuItem>
                                <MenuItem eventKey="3" id={3} onClick={this.handleSelectPriority.bind(this)}>{3}</MenuItem>
                              </DropdownButton>
                                </div>

                              <div className="select-status">
                                <Col componentClass={ControlLabel} sm={2}>Status: </Col>
                                <DropdownButton title={this.state.status ? this.state.status : this.props.currentTicket.status} pullRight id="split-button-pull-right">
                                    <MenuItem eventKey="1" onClick={this.handleSelectStatus.bind(this)}>{'not started'}</MenuItem>
                                    <MenuItem eventKey="2" onClick={this.handleSelectStatus.bind(this)}>{'in progress'}</MenuItem>
                                    <MenuItem eventKey="3" onClick={this.handleSelectStatus.bind(this)}>{'complete'}</MenuItem>
                                  </DropdownButton>
                                </div>
                              
                              <div className="select-panel">
                                <Col componentClass={ControlLabel} sm={2}>Panel: </Col>
                                <DropdownButton title={this.state.panel_name ? this.state.panel_name : this.props.currentPanel.name} pullRight id="split-button-pull-right">
                                {this.props.panels.map(panel => <MenuItem id={panel.id} eventKey={panel.id} onClick={this.handleSelectPanel.bind(this)}> {panel.name} </MenuItem>)}
                                </DropdownButton>
                              </div>
                            </div>
                      
                      <div className="edit-cancel-ticket">
                        <Button style={buttonStyle} bsStyle="default" onClick={this.props.handleEditTicketRendered}>Cancel</Button>
                        <Button style={buttonStyle} bsStyle="primary" type="button" onClick={() => 
                          { 
                            let { panel_name, members, ...editedTicket} = this.state;
                            console.log(editedTicket);
                            this.props.handleEditCurrentTicket(Object.assign({}, editedTicket, {creator_id:
                            this.props.userId, board_id: this.props.currentBoard.id, id: this.props.currentTicket.id}), () => {
                              this.handleOnEdit();
                            }); 
                          this.props.handleEditTicketRendered(); this.resetForm();}}>Update</Button>
                        </div>
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
    userId: state.rootReducer.user.id,
    userHandle: state.rootReducer.user.github_handle,
    currentBoard: state.rootReducer.currentBoard,
    currentPanel: state.rootReducer.currentPanel,
    panels: state.rootReducer.panels,
    tickets: state.rootReducer.tickets,
    editTicketRendered: state.rootReducer.editTicketRendered,
    currentTicket: state.rootReducer.currentTicket
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleEditCurrentTicket(ticketObj, callback) {
      dispatch(putEditedTicket(ticketObj, callback));
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