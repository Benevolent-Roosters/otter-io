import React from 'react';
import { connect } from 'react-redux';
import { putEditedPanel, editPanel } from '../redux/actionCreators.js';
import axios from 'axios';
import { Modal, Form, FormGroup, ControlLabel, Col, FormControl, Button } from 'react-bootstrap';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';

class EditPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name
    }
  }

  reorderPanels(editedPanel) {
    let idx;
    for (let i = 0; i < props.panels.length; i++) {
      if (editedPanel.panelId === props.panels[i].panelId) {
        idx = i;
        break;
      }
    }
    return props.panels.slice(0, idx).concat(editedPanel).concat(props.panels.slice(idx + 1));
  }

  render() {
    return (
      <div>
        <Modal.Dialog>
          <Modal.Header style={{backgroundColor: '#7ED321'}}>
            <Modal.Title> Edit Panel </Modal.Title>
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
            <Button>Cancel</Button>
            <Button bsStyle="primary" onClick={() => {this.props.handleSetPanels()}}>Submit</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    userId: state.user.userid, //double check what userid key actually is named
    currentBoardId: state.currentBoard.boardid, //double check what userid key actually is named
    panels: state.panels
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleEditPanel(event) {
      dispatch(editPanel(reorderPanels(/*panelObj*/)));
      dispatch(putEditedPanel(/*panelObj*/))
    }
  };
};

export var UnwrappedEditPanel = EditPanel;
export default connect(mapStateToProps, mapDispatchToProps)(EditPanel);
