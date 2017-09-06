import React from 'react';
import { setCurrentBoard, setBoards, postCreatedBoard } from '../redux/actionCreators.js';
import { connect } from 'react-redux';

const CreateBoard = (props) => {
  return (
    <div>This is CreateBoard</div>
  );
};

const mapStateToProps = (state) => {
  return {
    'boards': state.boards,
    'currentBoard': state.currentBoard
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSetAndPostCreatedBoard(boardObj) {
      dispatch(postCreatedBoard(boardObj));
    }
  };
};

export var UnwrappedCreateBoard = CreateBoard;
export default connect(mapStateToProps, mapDispatchToProps)(CreateBoard);
