import React from 'react';
import { getTicketsByPanel, toggleCreateTicket, postCreatedTicket } from '../redux/actionCreators.js';
import { connect } from 'react-redux';
import { Modal, Form, FormGroup, FormControl, Button, ControlLabel, Grid, Col, Row, DropdownButton, MenuItem, ButtonToolbar } from 'react-bootstrap';

const buttonStyle = {marginTop: '15px', marginRight: '15px'};
const dropDownStyle = {marginTop: '15px'};

class CreateTicket extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      status: '',
      priority: 0,
      type: '',
      creator_id: this.props.userId,
      assignee_handle: this.props.userHandle,
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

  render() {
    return (
      <div>
        <Grid>
          <Col sm={12}>
            <Row>
              <Modal show={this.props.createTicketRendered ? true : false}>
                <Modal.Header bsSize='large' style={{backgroundColor: '#7ED321'}}>
                  <Modal.Title style={{color: 'white'}}>Create Ticket</Modal.Title>
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
                        <FormControl name='Ticket Description' componentClass="textarea" bsSize="large" value={this.state.description} placeholder={'What needs to be done?'} onChange={this.handleDescriptionChange.bind(this)}></FormControl>
                        </Col>
                      </FormGroup>
                       
                      <ButtonToolbar>
                        <DropdownButton title={this.state.assignee_handle ? this.state.assignee_handle : 'Who should do this?'} pullRight id="split-button-pull-right">
                          <MenuItem eventKey="1" onClick={this.handleSelectAssignee.bind(this)}>{this.props.userHandle}</MenuItem>
                        </DropdownButton>
                        
                        <DropdownButton title={this.state.type ? this.state.type : 'Specify that type of ticket'} pullRight id="split-button-pull-right">
                          <MenuItem eventKey="1" onClick={this.handleSelectType.bind(this)}>{'bug'}</MenuItem>
                          <MenuItem eventKey="2" onClick={this.handleSelectType.bind(this)}>{'feature'}</MenuItem>
                          <MenuItem eventKey="3" onClick={this.handleSelectType.bind(this)}>{'devops'}</MenuItem>
                        </DropdownButton>

                        <DropdownButton title={this.state.priority ? this.state.priority : 'How important is this?'} pullRight id="split-button-pull-right">
                          <MenuItem eventKey="1" onClick={this.handleSelectPriority.bind(this)}>{1}</MenuItem>
                          <MenuItem eventKey="2" onClick={this.handleSelectPriority.bind(this)}>{2}</MenuItem>
                          <MenuItem eventKey="3" onClick={this.handleSelectPriority.bind(this)}>{3}</MenuItem>
                        </DropdownButton>

                        <DropdownButton title={this.state.status ? this.state.status : 'What is the ticket status?'} pullRight id="split-button-pull-right">
                          <MenuItem eventKey="1" onClick={this.handleSelectStatus.bind(this)}>{'not started'}</MenuItem>
                          <MenuItem eventKey="2" onClick={this.handleSelectStatus.bind(this)}>{'in progress'}</MenuItem>
                          <MenuItem eventKey="3" onClick={this.handleSelectStatus.bind(this)}>{'complete'}</MenuItem>
                        </DropdownButton>
                        
                      </ButtonToolbar>
                      <Button style={buttonStyle} bsStyle="default" onClick={this.props.handleCreateTicketRendered}>Cancel</Button>
                      <Button style={buttonStyle} bsStyle="primary" type="button" onClick={() => {this.props.handleSetTickets(Object.assign({}, this.state, {creator_id: this.props.userId, panel_id: this.props.currentPanel.id, board_id: this.props.currentBoardId})); this.props.handleCreateTicketRendered();}}>Create</Button>
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
    currentBoardId: state.rootReducer.currentBoard.id, 
    currentPanel: state.rootReducer.currentPanel,
    panels: state.rootReducer.panels,
    createTicketRendered: state.rootReducer.createTicketRendered
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleSetTickets(newTicket) {
      dispatch(postCreatedTicket(newTicket));
    },
    handleCreateTicketRendered() {
      dispatch(toggleCreateTicket());
    }
  };
};

export var UnwrappedCreatePanel = CreateTicket;
export default connect(mapStateToProps, mapDispatchToProps)(CreateTicket);
