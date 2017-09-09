import React from 'react';
import { setCurrentBoard, setBoards, postCreatedBoard, toggleCreateBoard } from '../redux/actionCreators.js';
import { connect } from 'react-redux';
import { Modal, Form, FormGroup, FormControl, Button, ControlLabel, Grid, Col, Row } from 'react-bootstrap';

let buttonStyle = {marginTop: '15px', marginRight: '15px'};

class CreateBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      board_name: '',
      repo_url: '',
      owner_id: this.props.owner_id
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
              <Modal show={this.props.createBoardRendered ? true : false}>
                <Modal.Header bsSize='large' style={{backgroundColor: '#7ED321'}}>
                  <Modal.Title style={{color: 'white'}}>Create Board</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form horizontal>
                      <FormGroup>
                        <Col componentClass={ControlLabel} sm={4}>Board Name</Col>
                        <Col sm={8}>
                        <FormControl name='board_name' bsSize="large" type="text" value={this.state.board_name} placeholder={'Board name'} onChange={this.handleInputChange.bind(this)}></FormControl>
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Col componentClass={ControlLabel} sm={4}>Github Repo URL</Col>
                        <Col sm={8}>
                        <FormControl name='repo_url' bsSize="large" type="text" value={this.state.repo_url} placeholder={'Github Repo'} onChange={ this.handleInputChange.bind(this)}></FormControl>
                        </Col>
                      </FormGroup>
                      <Button style={buttonStyle} bsStyle="default" onClick={this.props.handleCreateBoardRendered}>Cancel</Button>
                      <Button style={buttonStyle} bsStyle="primary" type="button" onClick={() => this.props.handleSetAndPostCreatedBoard(this.state)}>Create</Button>
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

const mapStateToProps = (state) => {
  return {
    'boards': state.boards,
    'currentBoard': state.currentBoard,
    'createBoardRendered': state.createBoardRendered,
    'boardBeingCreated': state.boardBeingCreated,
    'owner_id': state.user.id
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSetAndPostCreatedBoard(boardObj) {
      dispatch(postCreatedBoard(boardObj));
    },
    handleCreateBoardRendered() {
      dispatch(toggleCreateBoard());
    }
  };
};

export var UnwrappedCreateBoard = CreateBoard;
export default connect(mapStateToProps, mapDispatchToProps)(CreateBoard);
