import React from 'react';
import { inviteToBoard, putEditedBoard, editBoards, toggleEditBoard } from '../redux/actionCreators.js';
import { connect } from 'react-redux';
import { Modal, Form, FormGroup, FormControl, Button, ControlLabel, Grid, Col, Row } from 'react-bootstrap';

const buttonStyle = {marginTop: '15px', marginRight: '15px'};

class EditBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      board_name: '',
      repo_url: '',
      members: '',
      owner_id: this.props.owner_id,
      id: this.props.currentBoard.id
    };
  }

  reorderBoards(editedBoard) {
    let idx;
    for (let i = 0; i < this.props.boards.length; i++) {
      if (editedBoard.id === this.props.boards[i].id) {
        idx = i;
        break;
      }
    }
    return this.props.boards.slice(0, idx).concat(editedBoard).concat(this.props.boards.slice(idx + 1));
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      owner_id: this.props.owner_id,
      id: this.props.currentBoard.id      
    });
  }

  render() {
    return (
      <div>
        <Grid>
          <Col sm={12}>
            <Row>
              <Modal show={this.props.editBoardRendered}>
                <Modal.Header bsSize='large' style={{backgroundColor: '#7ED321'}}>
                  <Modal.Title style={{color: 'white'}}>Edit Board</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form horizontal>

                      <FormGroup>
                        <Col componentClass={ControlLabel} sm={4}>Board Name</Col>
                        <Col sm={8}>
                        <FormControl name='board_name' bsSize="large" type="text" value={this.state.board_name} placeholder={this.props.currentBoard.board_name} onChange={this.handleInputChange.bind(this)}></FormControl>
                        </Col>
                      </FormGroup>

                      <FormGroup>
                        <Col componentClass={ControlLabel} sm={4}>Github Repo URL</Col>
                        <Col sm={8}>
                        <FormControl name='repo_url' bsSize="large" type="text" value={this.state.repo_url} placeholder={this.props.currentBoard.repo_url} onChange={ this.handleInputChange.bind(this)}></FormControl>
                        </Col>
                      </FormGroup>
                    </Form>
                  
                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={4}>Add Members</Col>
                      <Col sm={8}>
                      <FormControl name='members' bsSize="large" type="text" value={this.state.members} placeholder={'enter emails separated by commas'} onChange={this.handleInputChange.bind(this)}></FormControl>
                      </Col>
                    </FormGroup>

                    <Button style={buttonStyle} bsStyle="default" onClick={this.props.handleEditBoardRendered}>Cancel</Button>
                    <Button style={buttonStyle} bsStyle="primary" type="button" onClick={() => {
                      let { members, ...editedBoard} = this.state;
                      this.props.handleEditBoard(this.reorderBoards.bind(this), editedBoard); 
                      this.props.handleEditBoardRendered(); 
                      this.props.handleInviteBoard(this.state.id, this.state.members); }}>Update</Button>
                    
                  </Modal.Body>
                </Modal>
                </Row>
              </Col>
            </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    boards: state.rootReducer.boards,
    currentBoard: state.rootReducer.currentBoard,
    editBoardRendered: state.rootReducer.editBoardRendered,
    owner_id: state.rootReducer.user.id
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleEditBoard(callback, boardObj) {
      dispatch(editBoards(callback(boardObj)));
      dispatch(putEditedBoard(boardObj))
    },
    handleEditBoardRendered() {
      dispatch(toggleEditBoard());
    },
    handleInviteBoard(boardId, commaSeparatedEmails) {
      dispatch(inviteToBoard(boardId, commaSeparatedEmails));
    }
  };
};


export var UnwrappedEditBoard = EditBoard;
export default connect(mapStateToProps, mapDispatchToProps)(EditBoard);
