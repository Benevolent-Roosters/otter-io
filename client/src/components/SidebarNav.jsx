import React from 'react';
import { connect } from 'react-redux';
import { setCurrentBoard, setBoards } from '../redux/actionCreators';


const SidebarNavigation = (props) => {
  return (
    <div>This is SidebarNavigation</div>
  );
};

const mapStateToProps = (state) => {
  return {
    'gitHandle': state.gitHandle,
    'profilePicture': state.profilePicture,
    'boards': state.boards,
    'currentBoard': state.currentBoard
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSetCurrentBoard(boardClicked) {
      dispatch(setCurrentBoard(boardClicked));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarNavigation);