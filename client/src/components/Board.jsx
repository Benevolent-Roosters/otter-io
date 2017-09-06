import React from 'react';
import Panel from './Panel.jsx';
import { getPanelsByBoard } from '../redux/actionCreators.js';
import { connect } from 'react-redux';

const Board = (props) => {
  return (
    <div>I love pie</div>
  );
};

const mapStateToProps = (state) => {
  return {
    'currentBoard': state.currentBoard,
    'panels': state.panels
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    handleGetPanelsByBoard(panels) {
      dispatch(getPanelsByBoard(panels));
    }
  };
};

export var UnwrappedBoard = Board;
export default connect(mapStateToProps, mapDispatchToProps)(Board);