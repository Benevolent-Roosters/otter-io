import { SET_USER, SET_CURRENT_BOARD, SET_BOARDS, SET_PANELS, SET_TICKETS, SET_CURRENT_PANEL } from './actions';
import axios from 'axios';


export function setUser(user) {
  return {type: SET_USER, value: user};
}

export function setCurrentBoard(clickedBoard) {
  return {type: SET_CURRENT_BOARD, value: clickedBoard};
}

export function setCurrentPanel(panel) {
  return {type: SET_CURRENT_PANEL, value: panel};
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

export function editBoards(boards) {
  return {type: EDIT_BOARDS, value: boards};
}

export function editCurrentBoard(boardObj) {
  return {type: EDIT_CURRENT_BOARD, value: boardObj};
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
export function getTicketsByPanel(panelId) {
  return dispatch => {
    axios.get('/api/tickets', {panel_id: panelId})
      .then(response => {
        dispatch(setTickets(response.body));
        return response.body;
      })
      .catch(err => {
        console.log('Error in getTicketsByPanel: ', err);
      });
  };
}

/** Save the newly created board to the database & then retrieve all boards associated with a user **/

export function postCreatedBoard(newBoard, userGithubHandle, userid) {
  return (dispatch => {

    /** store the new board info and current userid (as owner) in the database **/
    axios.post('/api/boards', {board: newBoard, userid: userid})
      .then(() => {
        return getBoardsByUser(userGithubHandle);
      })
    /** Add new board info to board and currentBoard state ONLY if it successfully saved **/
      .then(response => {
        dispatch(setBoards(response));
        dispatch(setCurrentBoard(response[response.length - 1])); //set current state to most recently created Board
      })
      
      .catch(error => {
        console.log('ERROR ON CREATEBOARD:', error);
      });
  });
}

/** Upon creation a panel, save the panel to the database and then retrieve all panels associated with the board and set the currentpanel to the newly created one **/
export function postCreatedPanel(newPanel, boardid, userid) {
  return (dispatch => {
    axios.post('/api/panels', {panel: newPanel, userid: userid})
      .then(() => {
        return getPanelsByBoard(boardid);
      })
      .then(response => {
        // to ensure we don't get duplicates of all current panels in the board, only append the latest created panel
        dispatch(setPanels(response[response.length - 1]));
        dispatch(setCurrentPanel(response[response.length - 1])); //new panel is now current
      });
  });
}

/** Upon creation of a ticket, save the ticket to the database and then retrieve all tickets associated with all panels currently in state  **/
export function postCreatedTicket(newTicket, boardid, panelid, userid) {
  return (dispatch => {
    axios.post('/api/tickets', {ticket: newTicket, panelid: panelid, userid: userid})
      .then(() => {
        return getTicketsByPanel(panelid);
      })
      .then(response => {
        // to ensure we don't get duplicates of all current tickets in the panel, only append the latest created ticket
        dispatch(setTickets(response[response.length - 1])); 
        //no need to set current ticket upon creation
      });

  });
}

export function putCurrentBoard(boardObj) {
  return (dispatch => {
    axios.put('/api/boards', boardObj)
      .then(() => {
        editCurrentBoard(boardObj);
      });
  });
}
