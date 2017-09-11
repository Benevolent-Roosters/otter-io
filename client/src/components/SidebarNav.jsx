import React from 'react';
import { connect } from 'react-redux';
import { setCurrentBoard, toggleDrawer, toggleCreateBoard } from '../redux/actionCreators';
import { GridList, GridTile, Drawer } from 'material-ui';
import { Thumbnail, Image, Button } from 'react-bootstrap';

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
  return (
    <div>
      <Drawer containerStyle={{backgroundColor: '#ffffff'}} docked={false} open={props.drawerToggled} onRequestChange={(open) => props.handleToggledDrawer(open)}>
        <Thumbnail href="#" style={styles.profileImage} src={require('../images/business-person-silhouette-wearing-tie.png')} />

        <h3 style={{textAlign: 'center', marginBottom: '15px'}}>@dsc03</h3>

        <Button style={styles.createBoardButton} bsSize='large' bsStyle='primary' onClick={(open) => {props.handleToggledDrawer(open); props.handleCreateBoardRendered();}}>Create Board</Button>

        <GridList style={styles.gridList} cols={1} padding={15}>
          {props.boards.map((board) => 
            <GridTile style={{marginLeft: '15px', marginRight: '15px', backgroundColor: getRandomColor()}} key={board.id} title={board.board_name}> </GridTile>)}
        </GridList>

      </Drawer>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    'gitHandle': state.user.github_handle,
    'profilePicture': state.user.profile_photo,
    'boards': state.boards,
    'currentBoard': state.currentBoard,
    'drawerToggled': state.drawerToggled
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
    }
  };
};

export var UnwrappedSidebar = SidebarNavigation;
export default connect(mapStateToProps, mapDispatchToProps)(SidebarNavigation);

// {props.boards.map((board) => {
//   return <GridTile key={require('../images/menu.png')} title={'Cheese Pizza'}></GridTile>;
// })}