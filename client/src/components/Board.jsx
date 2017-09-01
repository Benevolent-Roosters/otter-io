import React from 'react';
import Panel from './Panel.jsx';
import { setPanels } from '../redux/actionCreators.js';
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
    handleSetPanels(panels) {
      dispatch(setPanels(panels));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);