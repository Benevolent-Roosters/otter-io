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
      id: this.props.currentPanel.id,
      name: this.props.currentPanel.name,
      due_date: this.props.currentPanel.due_date,
      board_id: this.props.currentBoardId
    };
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
      name: e.target.value,
      id: this.props.currentPanel.id,
      board_id: this.props.currentBoardId      
    });
  }

  handleDateChange(e, date) {
    this.setState({
      due_date: moment(date).format().slice(0, 10),
      id: this.props.currentPanel.id,
      board_id: this.props.currentBoardId  
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
                  <FormControl onChange={this.handleNameChange.bind(this)} placeholder={this.props.currentPanel.name}></FormControl>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={2}>
                  Due Date
                </Col>
                <Col sm={10}>
                  <DatePicker onChange={this.handleDateChange.bind(this)} hintText={this.props.currentPanel.due_date ? this.props.currentPanel.due_date.slice(0, 10) : 'Select a Due Date' }></DatePicker>
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.handleEditPanelRendered}>Cancel</Button>
            <Button bsStyle="primary" onClick={() => { 
              this.state.name ? this.props.handleEditPanel(this.reorderPanels.bind(this), this.state) : '';
              this.props.handleEditPanelRendered();
            }}>Submit</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    userId: state.rootReducer.user.userid, //double check what userid key actually is named
    currentBoardId: state.rootReducer.currentBoard.id, //double check what userid key actually is named
    panels: state.rootReducer.panels,
    currentPanel: state.rootReducer.currentPanel,
    editPanelRendered: state.rootReducer.editPanelRendered
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleEditPanel(callback, panelObj) {
      dispatch(editPanels(callback(panelObj)));
      dispatch(putEditedPanel(panelObj));
    },
    handleEditPanelRendered() {
      dispatch(toggleEditPanel());
    }
  };
};

export var UnwrappedEditPanel = EditPanel;
export default connect(mapStateToProps, mapDispatchToProps)(EditPanel);
