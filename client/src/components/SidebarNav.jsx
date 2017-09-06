import React from 'react';
import { connect } from 'react-redux';
import { setCurrentBoard } from '../redux/actionCreators';


const SidebarNavigation = (props) => {
  return (
    <div>This is SidebarNavigation</div>
  );
};

const mapStateToProps = (state) => {
  return {
    'gitHandle': state.user.github_handle,
    'profilePicture': state.user.profile_photo,
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

export var UnwrappedSidebar = SidebarNavigation;
export default connect(mapStateToProps, mapDispatchToProps)(SidebarNavigation);