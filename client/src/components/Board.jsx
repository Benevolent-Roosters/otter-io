import React from 'react';
import { connect } from 'react-redux';
import { Carousel, Button, NavItem } from 'react-bootstrap';
import Slider from 'react-slick';
import PrevArrow from 'react-slick';
import '../../../ticketStyle.css';

import { getPanelsByBoard, getTicketsByPanel, toggleEditBoard } from '../redux/actionCreators.js';
import CreatePanel from './CreatePanel.jsx';
import EditBoard from './EditBoard.jsx';
import Panel from './Panel.jsx';
import EditPanel from './EditPanel.jsx';
import EditTicket from './EditTicket.jsx';
import CreateTicket from './CreateTicket.jsx';

const Board = (props) => {
  let settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 500,
    infinite: false,
    centerMode: true,
    focusOnSelect: true,
    draggable: false,
    initialSlide: 3,
    useCSS: true,
    slickGoTo: 3
  };

  const panelStyle = {
    height: '650px'
  };

  const boardNameStyle = {
    fontSize: '20px',
    color: 'black',
    fontWeight: 'normal',
    display: 'flex',
    listStyle: 'none',
  };

  return (  
    <div>
      <CreatePanel />
      <EditBoard />
      <EditPanel />
      <CreateTicket />
      <EditTicket />
      <NavItem className="boardName" style={boardNameStyle} eventKey={1} onClick={() => {
        props.handleEditBoardRendered();}}>
        {props.currentBoard.board_name}
      </NavItem> 
      <Slider {...settings}>
        {props.panels.map(panel => 
        <div><Panel panelInfo={panel} key={panel.id} style={panelStyle}/></div>)}
      </Slider>
    </div>
  );
};

//NOTE: most likely NOT necessary if upon entering new board we navigate to new route, because navigating to new route will re-render app (we think).
const mapStateToProps = (state) => {
  return {
    'currentBoard': state.rootReducer.currentBoard,
    'panels': state.rootReducer.panels,
    currentPanel: state.rootReducer.currentPanel
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleGetPanelsByBoard(panels) {
      dispatch(getPanelsByBoard(panels));
    },
    handleGetTicketsByPanel(panelId) {
      dispatch(getTicketsByPanel(panelId));
    },
    handleEditBoardRendered() {
      dispatch(toggleEditBoard());
    }
  };
};

export var UnwrappedBoard = Board;
export default connect(mapStateToProps, mapDispatchToProps)(Board);

