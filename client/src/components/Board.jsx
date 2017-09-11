import React from 'react';
import { connect } from 'react-redux';
import Panel from './Panel.jsx';
import { getPanelsByBoard, getTicketsByPanel } from '../redux/actionCreators.js';
import { Carousel, Button } from 'react-bootstrap';
import Slider from 'react-slick';
import PrevArrow from 'react-slick';


const Board = (props) => {
  // let boardPanels = props.handleGetPanelsByBoard(props.panels);
  let settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 500,
    infinite: false,
    centerMode: true,
    focusOnSelect: true,
    draggable: false,
    initialSlide: 3
    /*currentSlide: props.currentPanel*/
  }

  let panelStyle = {
    height: '650px'
  }
  return (
      <Slider {...settings}>
        <div><Panel style={panelStyle}/></div>
        <div><Panel style={panelStyle}/></div>
        <div><Panel style={panelStyle}/></div>
        <div><Panel style={panelStyle}/></div>
        <div><Panel style={panelStyle}/></div>
        <div><Panel style={panelStyle}/></div>
      </Slider>
  );
};

//NOTE: most likely NOT necessary if upon entering new board we navigate to new route, because navigating to new route will re-render app (we think).
const mapStateToProps = (state) => {
  return {
    'currentBoard': state.currentBoard,
    'panels': state.panels,
    currentPanel: state.currentPanel
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

