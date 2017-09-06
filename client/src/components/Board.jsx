import React from 'react';
import Panel from './Panel.jsx';
import { getPanelsByBoard, getTicketsByPanel } from '../redux/actionCreators.js';
import { connect } from 'react-redux';

const Board = (props) => {
  return (
    <div>I love pie</div>
  );
};

//NOTE: most likely NOT necessary if upon entering new board we navigate to new route, because navigating to new route will re-render app (we think).
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
    },
    handleGetTicketsByPanel(panelId) {
      dispatch(getTicketsByPanel(panelId));
    }
  };
};

export var UnwrappedBoard = Board;
export default connect(mapStateToProps, mapDispatchToProps)(Board);