import { SET_USER, SET_CURRENT_BOARD, SET_BOARDS, SET_PANELS, SET_TICKETS } from './actions';
import axios from 'axios';

export function setUser(user) {
  return {type: SET_USER, value: user};
}

export function setCurrentBoard(clickedBoard) {
  return {type: SET_CURRENT_BOARD, value: clickedBoard};
}

export function setPanels(panels) {
  return {type: SET_PANELS, value: panels};
}

/** setBoards is used to both retrieve boards from db and to create a new board and add it to state **/
export function setBoards(boards) { 
  return {type: SET_BOARDS, value: boards};
}

export function setTickets(tickets) {
  return {type: SET_TICKETS, value: tickets};
}

/** Upon Login, perform asynchronous Axios request to get user information and 
  **/
export function getUserInfo() {
  return (dispatch) => {
    axios.get('/profile')
      .then((response) => {
        dispatch(setUser(response.body));
        return response.body;
      })

      .catch((error) => {
        console.log('ERROR ON GETUSERINFO:', error);
      });
  };
}

/** Use the loggedin user's Github handle to retrieve their boards **/
export function getBoardsByUser(userGitHandle) {
  return (dispatch) => {
    axios.get('/api/boards', {github_handle: userGitHandle})

      //set Boards state
      .then((response) => {
        dispatch(setBoards(response.body));
        dispatch(setCurrentBoard(response.body[response.body.length - 1])); //set current state to most recently created Board
        return response.body[response.body.length - 1]; //return value so that you can chain this to setPanels
      })

      .catch((error) => {
        console.log(error);
      });
  };
}

/** Grab the selected board (or, in the case of login, grab the most recently created board) and return all the panels associated with it  **/
//TODO: set current panel by looking at dates and sorting panels appropriately
export function getPanelsByBoard(boardid) {
  return (dispatch) => {
    axios.get('/api/panels', {board_id: boardid})
      .then((response) => {
        dispatch(setPanels(response.body));
        return response.body;
      })
      .catch((response) => {
        console.log('ERROR ON GETPANELSBYBOARD:', error);
      });
  };
}

/** Grab all the tickets associated with a board's panels **/
//TODO: sorting tickets in order of completion, followed by urgency
export function getTicketsByPanels(panelId) {
  return dispatch => {
    axios.get('/api/tickets', {panel_id: panelId})
      .then(response => {
        dispatch(setTickets(response.body));
      })
      .catch(err => {
        console.log('Error in getTicketsByPanels: ', err);
      });
  };
}

/** Save the newly created board to the database & then retrieve all boards associated with a user **/
//TODO: figure out how to handle owner_id when creating a board???
export function postCreatedBoard(newBoard, userGithubHandle) {
  return ((dispatch) => {

    /** store the new board info in the database **/
    axios.post('/api/boards', {board: newBoard})
      .then(() => {
        return getBoardsByUser(userGithubHandle);
      })
    /** Add new board info to board and currentBoard state ONLY if it successfully saved **/
      .then((response) => {
        dispatch(setBoards(response));
        dispatch(setCurrentBoard(response[response.length - 1])); //set current state to most recently created Board
      })
      
      .catch((error) => {
        console.log('ERROR ON CREATEBOARD:', error);
      });
  });
}

export function postCreatedPanel(newPanel, boardid) {
  return (dispatch => {

    axios.post('/api/panels', {panel: newPanel})
      .then(() => {
        return getPanelsByBoard(boardid);
      })
      .then((response => {
        dispatch(setPanels(response));
      })

  })
}
