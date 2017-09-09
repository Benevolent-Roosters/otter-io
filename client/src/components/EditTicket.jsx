import React from 'react';
import { connect } from 'react-redux';
import { putEditedTicket, editTickets, editCurrentTicket, toggleEditTicket } from '../redux/actionCreators.js';
import { Modal, Form, FormGroup, FormControl, Button, ControlLabel, Grid, Col, Row, SplitButton, MenuItem } from 'react-bootstrap';
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

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div>
        <Grid>
          <Col sm={12}>
            <Row>
              <Modal show={this.props.editTicketRendered ? true : false}>
                <Modal.Header bsSize='large' style={{backgroundColor: '#7ED321'}}>
                  <Modal.Title style={{color: 'white'}}>Edit Ticket</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form horizontal>
                      <FormGroup>
                        <Col componentClass={ControlLabel} sm={4}>Ticket Title</Col>
                        <Col sm={8}>
                        <FormControl name='Ticket Title' bsSize="large" type="text" value={this.state.title} placeholder={'Ticket Title'} onChange={this.handleInputChange.bind(this)}></FormControl>
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Col componentClass={ControlLabel} sm={4}>Ticket Description</Col>
                        <Col sm={8}>
                        <FormControl name='Ticket Description' bsSize="large" type="textarea" value={this.state.description} placeholder={'What needs to be done?'} onChange={this.handleInputChange.bind(this)}></FormControl>
                        </Col>
                      </FormGroup>
                      
                      <Col sm={2}>
                      <SplitButton title="Ticket Assignee" pullRight id="split-button-pull-right">
                        <MenuItem eventKey="1">Action</MenuItem>
                        <MenuItem eventKey="2">Another action</MenuItem>
                        <MenuItem eventKey="3">Something else here</MenuItem>
                      </SplitButton>
                      </Col>

                      <Col sm={2}>
                      <SplitButton title="Ticket Type" pullRight id="split-button-pull-right">
                        <MenuItem eventKey="1">Action</MenuItem>
                        <MenuItem eventKey="2">Another action</MenuItem>
                        <MenuItem eventKey="3">Something else here</MenuItem>
                      </SplitButton>
                      </Col>

                      <Col sm={2}>
                      <SplitButton title="Priority Level" pullRight id="split-button-pull-right">
                        <MenuItem eventKey="1">Action</MenuItem>
                        <MenuItem eventKey="2">Another action</MenuItem>
                        <MenuItem eventKey="3">Something else here</MenuItem>
                      </SplitButton>
                      </Col>

                      <Col sm={2}>
                      <SplitButton title="Ticket Panel" pullRight id="split-button-pull-right">
                        <MenuItem eventKey="1">Action</MenuItem>
                        <MenuItem eventKey="2">Another action</MenuItem>
                        <MenuItem eventKey="3">Something else here</MenuItem>
                      </SplitButton>
                      </Col>
                      
                      <Button style={buttonStyle} bsStyle="default" onClick={this.props.handleEditTicketRendered}>Cancel</Button>
                      <Button style={buttonStyle} bsStyle="primary" type="button" onClick={() => this.props.handleEditTickets(this.state)}>Create</Button>
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
    handleEditCurrentTicket(event) {
      dispatch(editCurrentTicket(/**ticketObj from event **/));
    },
    handleEditTicketRendered(tickets) {
      dispatch(toggleEditTicket(tickets));
    }
  };
};

export var UnwrappedEditTicket = EditTicket;
export default connect(mapStateToProps, mapDispatchToProps)(EditTicket);