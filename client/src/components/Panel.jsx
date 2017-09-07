import React from 'react';
import { getPanelsByBoard } from '../redux/actionCreators.js';

const Panel = props => {
  return (
    <div>In Panels</div>
  );
};

//NOTE: most likely NOT necessary if upon entering new board we navigate to new route, because navigating to new route will re-render app (we think).
const mapStateToProps = (state) => {
  return {
    'currentBoardId': state.currentBoard.boardid,
    'currentPanel': state.currentPanel,
    'tickets': state.tickets
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

export var UnwrappedPanel = Panel;
export default connect(mapStateToProps, mapDispatchToProps)(Panel);