import React from 'react';
import { connect } from 'react-redux';
import { setCurrentBoard, toggleDrawer, toggleCreateBoard, getPanelsByBoard, getTicketsByPanel, setCurrentPanel, setPanels, setTickets, emptyPanels, emptyTickets  } from '../redux/actionCreators';
import { GridList, GridTile, Drawer } from 'material-ui';
import { Thumbnail, Image, Button } from 'react-bootstrap';
import moment from 'moment';
import { Link } from 'react-router-dom';

/** STYLES FOR MATERIAL-UI COMPONENTS, GRID TILE STYLE DONE INLINE DUE TO NEED TO REFERENCE getRandomColor() **/
const styles = {
  gridList: {
    marginTop: '25px',
    marginBottom: '25px'
  },

  createBoardButton: {
    display: 'block',
    margin: '0 auto'
  },

  userHandle: {
    textAlign: 'center', 
    marginBottom: '15px'
  }
};

const SidebarNavigation = (props) => {

  let getRandomColor = function() {
    var letters = '0123456789ABCDEF';
    var color = '#';
  
    if (props.drawerToggled) {
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  };

  let findCurrentPanel = (panels) => {
    let dueDates = panels.map(panel => panel.due_date.slice(0, 10));
    let closest = 0;
    for (let i = 0; i < dueDates.length; i++) {
      if (moment().diff(dueDates[i]) < 0 && moment().diff(dueDates[i]) > moment().diff(dueDates[closest])) {
        closest = i;
      }
    }
    return closest;
  };

  let onBoardClick = (boardid) => {
    props.handleSetPanels(boardid, function(panels) {
      if (panels.length !== 0) {
        props.handleEmptyTickets();
        for (let panel of panels) {      
          props.handleSetTickets(panel.id);
        }
        let closestIndex = findCurrentPanel(panels);
        props.handleSetCurrentPanel(panels[closestIndex]);    
      } else {
        props.handleEmptyPanels();
        props.handleEmptyTickets();
      }
    });
  };

  return (
    <div>
      <Drawer containerStyle={{backgroundColor: '#ffffff'}} docked={false} open={props.drawerToggled} onRequestChange={(open) => props.handleToggledDrawer(open)}>
        <Thumbnail href="#" src={require('../images/business-person-silhouette-wearing-tie.png')} />

        <h3 style={styles.userHandle}>@{props.gitHandle}</h3>

        <Button style={styles.createBoardButton} bsSize='large' bsStyle='primary' onClick={(open) => {props.handleToggledDrawer(open); props.handleCreateBoardRendered();}}>Create Board</Button>

        <GridList className="grid-list" style={styles.gridList} cols={1} padding={15}>
          {props.boards.map(board => 
            <Link to={`/boards/${board.id}`}>
              <GridTile style={{marginLeft: '15px', marginRight: '15px', backgroundColor: getRandomColor()}} 
                key={board.id} title={board.board_name} 
                onClick={() => { onBoardClick(board.id); props.handleSetCurrentBoard(board); props.handleToggledDrawer(); }}> 
              </GridTile>
            </Link>
            )
          }
        </GridList>

      </Drawer>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    gitHandle: state.rootReducer.user.github_handle,
    profilePicture: state.rootReducer.user.profile_photo,
    boards: state.rootReducer.boards,
    currentBoard: state.rootReducer.currentBoard,
    drawerToggled: state.rootReducer.drawerToggled
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSetCurrentBoard(boardClicked) {
      dispatch(setCurrentBoard(boardClicked));
    }, 
    handleToggledDrawer(open) {
      dispatch(toggleDrawer(open));
    },
    handleCreateBoardRendered() {
      dispatch(toggleCreateBoard());
    },
    handleSetPanels(boardid, callback) {
      dispatch(getPanelsByBoard(boardid, callback));
    },
    handleSetTickets(panelId) {
      dispatch(getTicketsByPanel(panelId));
    },
    handleSetCurrentPanel(panel) {
      dispatch(setCurrentPanel(panel));
    },
    handleEmptyPanels() {
      dispatch(emptyPanels());
    },
    handleEmptyTickets() {
      dispatch(emptyTickets());
    }
  };
};

export var UnwrappedSidebar = SidebarNavigation;
export default connect(mapStateToProps, mapDispatchToProps)(SidebarNavigation);
