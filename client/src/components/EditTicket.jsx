import React from 'react';
import { connect } from 'react-redux';
import { putEditedTicket, editTickets, editCurrentTicket, toggleEditTicket } from '../redux/actionCreators.js';
import { Modal, Form, FormGroup, FormControl, Button, ControlLabel, Grid, Col, Row, DropdownButton, MenuItem, ButtonToolbar } from 'react-bootstrap';
import axios from 'axios';

let buttonStyle = {marginTop: '15px', marginRight: '15px'};
let dropDownStyle = {marginTop: '15px'};

class EditTicket extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      status: '',
      priority: 0,
      type: '',
      creator_id: this.props.userId,
      assignee_id: this.props.userId,
      panel_id: this.props.currentPanel.id,
      board_id: this.props.currentBoardId
    };
  }
handleTitleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      title: event.target.value
    });
  }

  handleDescriptionChange(event) {
    this.setState({
      description: event.target.value
    })
  }

  handleSelectAssignee(eventKey) {
    this.setState({
      assignee_id: eventKey
    });
  }

  handleSelectType(eventKey) {
    let types = ['Bug', 'Feature', 'Cleanup'];
    this.setState({
      type: types[eventKey - 1]
    });
  }

  handleSelectPriority(eventKey) {
    this.setState({
      priority: eventKey
    });
  }

  handleSelectPanel(eventKey) {
    this.setState({
      panel_id: eventKey
    })
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
                        <FormControl name='Ticket Title' bsSize="large" type="text" value={this.state.title} placeholder={'Ticket Title'} onChange={this.handleTitleChange.bind(this)}></FormControl>
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Col componentClass={ControlLabel} sm={4}>Ticket Description</Col>
                        <Col sm={8}>
                        <FormControl name='Ticket Description' bsSize="large" type="textarea" value={this.state.description} placeholder={'What needs to be done?'} onChange={this.handleDescriptionChange.bind(this)}></FormControl>
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <FormControl componentClass="select" placeholder="Assignee">
                          <option value="select">Brendan</option>
                          <option value="other">Brendan</option>
                          <option value="final">Seriously, give it to Brendan</option>
                        </FormControl>
                        <FormControl componentClass="select" placeholder="Ticket Type">
                          <option value="select">Bug</option>
                          <option value="other">Feature</option>
                          <option value="final">Cleanup</option>
                        </FormControl>
                        <FormControl componentClass="select" placeholder="Priority Level">
                          <option value="select">1</option>
                          <option value="other">2</option>
                          <option value="final">3</option>
                        </FormControl>
                        <FormControl componentClass="select" placeholder="Panel">
                          <option value="select">This one</option>
                          <option value="other">That one</option>
                          <option value="final">The other one</option>
                        </FormControl>
                      </FormGroup>
                      <Button style={buttonStyle} bsStyle="default" onClick={this.props.handleEditTicketRendered}>Cancel</Button>
                      <Button style={buttonStyle} bsStyle="primary" type="button" onClick={() => this.props.handleEditCurrentTicket(this.state)}>Create</Button>
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
    userId: state.user.userid, //double check what userid key actually is named
    currentBoardId: state.currentBoard.boardid, //double check what userid key actually is named,
    currentPanel: state.currentPanel,
    panels: state.panels,
    editTicketRendered: state.editTicketRendered
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleEditCurrentTicket(ticketObj) {
      dispatch(putEditedTicket(ticketObj))
      dispatch(editCurrentTicket(ticketObj));
    },
    handleEditTicketRendered(tickets) {
      dispatch(toggleEditTicket(tickets));
    }
  };
};

export var UnwrappedEditTicket = EditTicket;
export default connect(mapStateToProps, mapDispatchToProps)(EditTicket);

                      // <ButtonToolbar>
                      //   <DropdownButton title="Ticket Assignee" pullRight id="split-button-pull-right">
                      //     <MenuItem eventKey="1" onSelect={(eventKey) => this.handleSelectAssignee(eventKey)}>{'Brendan'}</MenuItem>
                      //     <MenuItem eventKey="2" onSelect={(eventKey) => this.handleSelectAssignee(eventKey)}>{'Brendan'}</MenuItem>
                      //     <MenuItem eventKey="3" onSelect={(eventKey) => this.handleSelectAssignee(eventKey)}>{'Seriously, give it to Brendan'}</MenuItem>
                      //   </DropdownButton>
                        
                      //   <DropdownButton title="Ticket Type" pullRight id="split-button-pull-right">
                      //     <MenuItem eventKey="1" onSelect={(eventKey) => this.handleSelectType(eventKey)}>{'Bug'}</MenuItem>
                      //     <MenuItem eventKey="2" onSelect={(eventKey) => this.handleSelectType(eventKey)}>{'Feature'}</MenuItem>
                      //     <MenuItem eventKey="3" onSelect={(eventKey) => this.handleSelectType(eventKey)}>{'Cleanup'}</MenuItem>
                      //   </DropdownButton>

                      //   <DropdownButton title="Priority Level" pullRight id="split-button-pull-right">
                      //     <MenuItem eventKey="1" onSelect={(eventKey) => this.handleSelectPriority(eventKey)}>{'Priority 1'}</MenuItem>
                      //     <MenuItem eventKey="2" onSelect={(eventKey) => this.handleSelectPriority(eventKey)}>{'Priority 2'}</MenuItem>
                      //     <MenuItem eventKey="3" onSelect={(eventKey) => this.handleSelectPriority(eventKey)}>{'Priority 3'}</MenuItem>
                      //   </DropdownButton>
                        
                      //   <DropdownButton title="Ticket Panel" pullRight id="split-button-pull-right">
                      //     <MenuItem eventKey="1" onSelect={(eventKey) => this.handleSelectPanel(eventKey)}>{'This one'}</MenuItem>
                      //     <MenuItem eventKey="2" onSelect={(eventKey) => this.handleSelectPanel(eventKey)}>{'That one'}</MenuItem>
                      //     <MenuItem eventKey="3" onSelect={(eventKey) => this.handleSelectPanel(eventKey)}>{'That other one'}</MenuItem>
                      //   </DropdownButton>
                      // </ButtonToolbar>