import React from 'react';
import { connect } from 'react-redux';
import { getUserInfo, getBoardsByUser } from '../redux/actionCreators.js';
import axios from 'axios';

const CreatePanel = props => {
  return (
    <div>In CreatePanel</div>
  );
};

const mapStateToProps = state => {
  return {
    panels: state.panels
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleSetPanels(newPanel) {
      dispatch()
    }
  }
}
export var UnwrappedCreatePanel = CreatePanel;
export default connect(mapStateToProps, mapDispatchToProps)(CreatePanel);
