import React from 'react';
import { connect } from 'react-redux';
import { putEditedPanel, editPanels, toggleEditPanel } from '../redux/actionCreators.js';
import axios from 'axios';
import { Modal, Form, FormGroup, ControlLabel, Col, FormControl, Button } from 'react-bootstrap';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';

class EditPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      due_date: ''
    }
  }

  reorderPanels(editedPanel) {
    let idx;
    for (let i = 0; i < this.props.panels.length; i++) {
      if (editedPanel.panelId === this.props.panels[i].panelId) {
        idx = i;
        break;
      }
    }
    return this.props.panels.slice(0, idx).concat(editedPanel).concat(this.props.panels.slice(idx + 1));
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
        <Modal show={this.props.editPanelRendered}>
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
            <Button onClick={this.props.handleEditPanelRendered}>Cancel</Button>
            <Button bsStyle="primary" onClick={() => {this.props.handleEditPanel(this.reorderPanels.bind(this), this.state)}}>Submit</Button>
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
    panels: state.panels,
    currentPanel: state.currentPanel,
    editPanelRendered: state.editPanelRendered
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleEditPanel(reorderPanels, panelObj) {
      dispatch(editPanels(reorderPanels(panelObj)));
      dispatch(putEditedPanel(panelObj))
    },
    handleEditPanelRendered() {
      dispatch(toggleEditPanel());
    }
  };
};

export var UnwrappedEditPanel = EditPanel;
export default connect(mapStateToProps, mapDispatchToProps)(EditPanel);
