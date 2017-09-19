import React from 'react';
import { connect } from 'react-redux';
import { setCurrentBoard, toggleDrawer, toggleCreateBoard, getPanelsByBoard, getTicketsByPanel, setCurrentPanel, setPanels, setTickets, emptyPanels, emptyTickets  } from '../redux/actionCreators';
import { GridList, GridTile, Drawer } from 'material-ui';
import { Thumbnail, Image, Button } from 'react-bootstrap';
import moment from 'moment';
import { Link } from 'react-router-dom';

let counter = 0; 

let getRandomColor = function() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    color: 'blue'
  },
  gridList: {
    marginTop: '25px',
    marginBottom: '25px'
  },

  tiles: {
    backgroundColor: getRandomColor()
  },

  profileImage: {
    display: 'block',
    margin: '0 auto', 
    marginTop: '15px', 
    marginLeft: '15px', 
    marginRight: '15px',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    border: '0px',
    borderRadius: '0px'
  },

  createBoardImage: {
    display: 'block',
    height: 'auto',
    maxWidth: '100%',
    marginTop: '15px',
    marginRight: 'auto',
    marginLeft: 'auto',
    position: 'absolute',
    bottom: '50px',
    left: '64.5px',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    border: '0px',
    borderRadius: '0px'
  },

  createBoardButton: {
    display: 'block',
    margin: '0 auto'
  }
};

const SidebarNavigation = (props) => {

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
        <Thumbnail href="#" style={styles.profileImage} src={require('../images/business-person-silhouette-wearing-tie.png')} />

        <h3 style={{textAlign: 'center', marginBottom: '15px'}}>@dsc03</h3>

        <Button style={styles.createBoardButton} bsSize='large' bsStyle='primary' onClick={(open) => {props.handleToggledDrawer(open); props.handleCreateBoardRendered();}}>Create Board</Button>

        <GridList style={styles.gridList} cols={1} padding={15}>
          {props.boards.map(board => 
            <Link to={`/boards/${board.id}`}>
              <GridTile style={{marginLeft: '15px', marginRight: '15px', backgroundColor: getRandomColor()}} 
                key={board.id} title={board.board_name} 
                onClick={() => { onBoardClick(board.id); props.handleSetCurrentBoard(board); props.handleToggledDrawer();}}> 
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
    'gitHandle': state.rootReducer.user.github_handle,
    'profilePicture': state.rootReducer.user.profile_photo,
    'boards': state.rootReducer.boards,
    'currentBoard': state.rootReducer.currentBoard,
    'drawerToggled': state.rootReducer.drawerToggled
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

// {props.boards.map((board) => {
//   return <GridTile key={require('../images/menu.png')} title={'Cheese Pizza'}></GridTile>;
// })}