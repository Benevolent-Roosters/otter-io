import React from 'react';
import { connect } from 'react-redux';
import { Carousel, Button, NavItem } from 'react-bootstrap';
import Slider from 'react-slick';
import PrevArrow from 'react-slick';
import '../../../styles.css';

import { getPanelsByBoard, getTicketsByPanel, toggleEditBoard, toggleCreatePanel, setCurrentPanel } from '../redux/actionCreators.js';
import Panel from './Panel.jsx';
import CreateBoard from './CreateBoard.jsx';
import CreatePanel from './CreatePanel.jsx';
import CreateTicket from './CreateTicket.jsx';
import EditBoard from './EditBoard.jsx';
import EditPanel from './EditPanel.jsx';
import EditTicket from './EditTicket.jsx';
import PerformanceDashboard from './PerformanceDashboard.jsx';

const Board = (props) => {

  const setCurrentPanelByIndex = (index) => {
    for (var i = 0; i < props.panels.length; i++) {
      if (index === i) {
        props.handleSetCurrentPanel(props.panels[i]);
      }
    }
  };

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
    slickGoTo: 3,
    afterChange: (index) => {setCurrentPanelByIndex(index);}
  };

  let panelStyle = {
    height: '650px'
  };

  return (  
    <div>
      <CreateBoard />
      <CreateTicket />
      <EditBoard />
      <EditPanel />
      <EditTicket />
      <CreatePanel />
      <PerformanceDashboard/>
      <div className="full-board">
        <div className="board-header">
          <NavItem className="board-name" eventKey={1} onClick={() => {
            props.handleEditBoardRendered();}}>
            {props.currentBoard.board_name}
          </NavItem> 
          <Button bsStyle="primary" onClick={() => props.handleCreatePanelRendered()}>Create Panel</Button>
        </div>
        <Slider {...settings}>
          {props.panels.map((panel, index) => 
          <div><Panel panelInfo={panel} key={panel.id} style={panelStyle}/></div>)}
        </Slider>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentBoard: state.rootReducer.currentBoard,
    panels: state.rootReducer.panels,
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
    },
    handleCreatePanelRendered() {
      dispatch(toggleCreatePanel());
    },
    handleSetCurrentPanel(panel) {
      dispatch(setCurrentPanel(panel));
    }
  };
};

export var UnwrappedBoard = Board;
export default connect(mapStateToProps, mapDispatchToProps)(Board);

