import React from 'react';
import { setCurrentBoard, setBoards } from '../redux/actionCreators.js';
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
    handleSetCurrentBoard(boardClicked) {
      dispatch(setCurrentBoard(boardClicked));
    },
    handleSetBoards(boardCreated) {
      dispatch(setBoards(boardCreated));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateBoard);

