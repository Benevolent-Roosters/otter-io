import React from 'react';
import { connect } from 'react-redux';
import { setCurrentBoard, toggleDrawer } from '../redux/actionCreators';
import { GridList, GridTile, Drawer } from 'material-ui';

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
    height: 650,
    overflowY: 'auto',
  },
};

const SidebarNavigation = (props) => {
  return (
    <div>
      <Drawer docked={false} open={props.drawerToggled} onRequestChange={(open) => props.handleToggledDrawer(open)}>
        <h3>@dsc03</h3>
        <GridList cols={1} style={styles.gridList}>
          <GridTile key={counter++} title={'that good pep'}><img src={require('../images/menu.png')}/></GridTile>
          <GridTile key={counter++} title={'Cheese Pizza'}><img src={require('../images/menu.png')}/></GridTile>
          <GridTile key={counter++} title={'akshidgf'}><img src={require('../images/menu.png')}/></GridTile>
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
    }
  };
};

export var UnwrappedSidebar = SidebarNavigation;
export default connect(mapStateToProps, mapDispatchToProps)(SidebarNavigation);

// {props.boards.map((board) => {
//   return <GridTile key={require('../images/menu.png')} title={'Cheese Pizza'}></GridTile>;
// })}