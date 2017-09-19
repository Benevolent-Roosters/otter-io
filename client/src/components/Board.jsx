import React from 'react';
import { connect } from 'react-redux';
<<<<<<< HEAD
=======
import Panel from './Panel.jsx';
import { getPanelsByBoard, getTicketsByPanel, toggleEditBoard } from '../redux/actionCreators.js';
>>>>>>> implemented css styling on boards, panels, and tickets
import { Carousel, Button, NavItem } from 'react-bootstrap';
import Slider from 'react-slick';
import PrevArrow from 'react-slick';
import '../../../ticketStyle.css';

import { getPanelsByBoard, getTicketsByPanel, toggleEditBoard, toggleCreatePanel } from '../redux/actionCreators.js';
import Panel from './Panel.jsx';
import CreateBoard from './CreateBoard.jsx';
import CreatePanel from './CreatePanel.jsx';
import CreateTicket from './CreateTicket.jsx';
import EditBoard from './EditBoard.jsx';
import EditPanel from './EditPanel.jsx';
import EditTicket from './EditTicket.jsx';

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
      <CreateBoard />
      <CreatePanel />
      <CreateTicket />
      <EditBoard />
      <EditPanel />
      <EditTicket />
      <NavItem className="boardName" style={boardNameStyle} eventKey={1} onClick={() => {
        props.handleEditBoardRendered();}}>
        {props.currentBoard.board_name}
      </NavItem> 
      <Button onClick={() => props.handleCreatePanelRendered()}>Create Panel</Button>
      <Slider {...settings}>
        {props.panels.map(panel => 
        <div><Panel panelInfo={panel} key={panel.id} style={panelStyle}/></div>)}
      </Slider>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
<<<<<<< HEAD
    'currentBoard': state.rootReducer.currentBoard,
    'panels': state.rootReducer.panels,
    currentPanel: state.rootReducer.currentPanel
=======
    'currentBoard': state.currentBoard,
    'panels': state.panels,
    'currentPanel': state.currentPanel
>>>>>>> implemented css styling on boards, panels, and tickets
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
<<<<<<< HEAD
    },
    handleCreatePanelRendered() {
      dispatch(toggleCreatePanel());
=======
>>>>>>> implemented css styling on boards, panels, and tickets
    }
  };
};

export var UnwrappedBoard = Board;
export default connect(mapStateToProps, mapDispatchToProps)(Board);

