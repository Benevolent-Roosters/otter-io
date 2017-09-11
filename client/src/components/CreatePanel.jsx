import React from 'react';
import { connect } from 'react-redux';
import { postCreatedPanel, toggleCreatePanel } from '../redux/actionCreators.js';
import axios from 'axios';
import { Modal, Form, FormGroup, ControlLabel, Col, FormControl, Button } from 'react-bootstrap';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';

class CreatePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      due_date: '',
      board_id: this.props.currentBoardId
    }
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }

  handleDateChange(e, date) {
    this.setState({
      due_date: moment(date).format().slice(0,10)
    });
  }

  render() {
    return (
      <div>
        <Modal show={this.props.createPanelRendered}>
          <Modal.Header style={{backgroundColor: '#7ED321'}}>
            <Modal.Title style={{color: 'white'}}> Create A Panel </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={2}>
                  Panel Name
                </Col>
                <Col sm={10}>
                  <FormControl onChange={this.handleNameChange.bind(this)} placeholder="Panel name" />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={2}>
                  Due Date
                </Col>
                <Col sm={10}>
                  <DatePicker onChange={this.handleDateChange.bind(this)} hintText="Pick a due date" />
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.handleCreatePanelRendered}>Cancel</Button>
            <Button bsStyle="primary" onClick={() => this.props.handleSetPanels(this.state)}>Submit</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    userId: state.user.userid, //double check what userid key actually is named
    currentBoardId: state.currentBoard.boardid, //double check what userid key actually is named
    createPanelRendered: state.createPanelRendered 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleSetPanels(newPanel) {
      dispatch(postCreatedPanel(newPanel));
    },
    handleCreatePanelRendered() {
      dispatch(toggleCreatePanel());
    }
  };
};

export var UnwrappedCreatePanel = CreatePanel;
export default connect(mapStateToProps, mapDispatchToProps)(CreatePanel);
