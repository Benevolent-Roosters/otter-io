import React from 'react';
import { connect } from 'react-redux';
import Panel from './Panel.jsx';
import { getPanelsByBoard, getTicketsByPanel } from '../redux/actionCreators.js';
import { Carousel, Button } from 'react-bootstrap';
import Slider from 'react-slick';
import PrevArrow from 'react-slick';

const Board = (props) => {
  return (
      <Slider arrow={true} centerMode={true} dots={true} infinite={true} speed={500} slidesToShow={2} slidesToScroll={1} focusOnSelect={true}>
        <div><h3>1</h3></div>
        <div><h3>2</h3></div>
        <div><h3>3</h3></div>
        <div><h3>4</h3></div>
        <div><h3>5</h3></div>
        <div><h3>6</h3></div>
        <div><h3>7</h3></div>
      </Slider>
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

