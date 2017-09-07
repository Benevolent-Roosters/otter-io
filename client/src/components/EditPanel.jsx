import React from 'react';
import { connect } from 'react-redux';
import { putEditedPanel, editPanel } from '../redux/actionCreators.js';
import axios from 'axios';

const EditPanel = props => {

  reorderPanels(editedPanel) {
    let idx;
    for (let i = 0; i < props.panels.length; i++) {
      if (editedPanel.panelId === props.panels[i].panelId) {
        idx = i;
      }
    }
    return props.panels.slice(0, idx).concat(editedPanel).concat(props.panels.slice(idx + 1));
  }

  render() {
    return (
      <div>In EditPanel</div>
    );
  }
};

const mapStateToProps = state => {
  return {
    userId: state.user.userid, //double check what userid key actually is named
    currentBoardId: state.currentBoard.boardid, //double check what userid key actually is named
    panels: state.panels
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleEditPanel(event) {
      dispatch(editPanel(reorderPanels(/*panelObj*/)));
      dispatch(putEditedPanel(/*panelObj*/))
    }
  };
};

export var UnwrappedEditPanel = EditPanel;
export default connect(mapStateToProps, mapDispatchToProps)(EditPanel);
