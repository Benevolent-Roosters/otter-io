import React from 'react';
import { putCurrentBoard, editBoards } from '../redux/actionCreators.js';
import { connect } from 'react-redux';

const EditBoard = (props) => {

  reorderBoards(editedBoard) {
    let idx;
    for (let i = 0; i < props.boards.length; i++) {
      if (editedBoard.boardId === props.boards[i].boardId) {
        idx = i;
      }
    }
    return props.boards.slice(0, idx).concat(editedBoard).concat(props.boards.slice(idx + 1));
  }

  render() {
     return (
      <div>This is EditBoard</div>
    )
  }

};

const mapStateToProps = (state) => {
  return {
    'boards': state.boards,
    'currentBoard': state.currentBoard
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleEditBoard(event) {
      dispatch(editBoards(reorderBoards(/*boardObj*/)));
      dispatch(putCurrentBoard(/*boardObj*/))
    }
  };
};


export var UnwrappedEditBoard = EditBoard;
export default connect(mapStateToProps, mapDispatchToProps)(EditBoard);
