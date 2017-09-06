import { SET_USER, SET_CURRENT_BOARD, SET_CURRENT_PANEL, SET_BOARDS, SET_PANELS, SET_TICKETS, EDIT_CURRENT_BOARD, EDIT_BOARDS, EDIT_PANELS, EDIT_CURRENT_PANEL, EDIT_TICKETS, EDIT_CURRENT_TICKET, TOGGLE_DRAWER, TOGGLE_CREATE_BOARD, TOGGLE_EDIT_BOARD, TOGGLE_CREATE_TICKET, TOGGLE_EDIT_TICKET, TOGGLE_EDIT_PANEL, TOGGLE_CREATE_PANEL } from './actions';

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

export function editPanels(panels) {
  return {type: EDIT_PANELS, value: panels};
}

export function editCurrentPanel(panelObj) {
  return {type: EDIT_CURRENT_PANEL, value: panelObj};
}

export function editTickets(tickets) {
  return {type: EDIT_TICKETS, value: tickets};
}

export function editCurrentTicket(ticketObj) {
  return {type: EDIT_CURRENT_TICKET, value: ticketObj};
}

export function toggleDrawer() {
  return {type: TOGGLE_DRAWER};
}

export function toggleCreateBoard() {
  return {type: TOGGLE_CREATE_BOARD};
}

export function toggleEditBoard() {
  return {type: TOGGLE_EDIT_BOARD};
}

export function toggleCreateTicket() {
  return {type: TOGGLE_CREATE_TICKET};
}

export function toggleEditTicket() {
  return {type: TOGGLE_EDIT_TICKET};
}

export function toggleCreatePanel() {
  return {type: TOGGLE_CREATE_PANEL};
}

export function toggleEditPanel() {
  return {type: TOGGLE_EDIT_PANEL};
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
export function getBoardsByUser() { //userid
  return (dispatch) => {
    axios.get('/api/boards') //{user_id: userid}

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
//TODO: Edit param names based on React CreateBoard form inputs obj
export function postCreatedBoard(newBoard) {
  return (dispatch => {

    /** store the new board info and current userid (as owner) in the database **/
    axios.post('/api/boards', newBoard) //owner_id: userid
      .then(() => {
        return getBoardsByUser();
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
//TODO: Edit param names based on React CreatePanel form inputs obj
export function postCreatedPanel(newPanel, boardid) {
  return (dispatch => {
    axios.post('/api/panels', newPanel) // userid: userid
      .then(() => {
        return getPanelsByBoard(boardid);
      })
      .then(response => {
        dispatch(setPanels(response));
        dispatch(setCurrentPanel(response[response.length - 1])); //new panel is now current
      });
  });
}

/** Upon creation of a ticket, save the ticket to the database and then retrieve all tickets associated with all panels currently in state  **/
//TODO: Edit param names based on React CreateTicket form inputs obj
export function postCreatedTicket(newTicket, panelid) {
  return (dispatch => {
    axios.post('/api/tickets', newTicket) //panelid: panelid, userid: userid
      .then(() => {
        return getTicketsByPanels(panelid);
      })
      .then(response => {
        dispatch(setTickets(response)); 
        //no need to set current ticket upon creation
      });
  });
}

/** When a user finishes editing a board's information, putEditedBoard stores the updated information in the database and dispatches an action to edit the currentBoard properties' state **/
export function putEditedBoard(boardObj) {
  return (dispatch => {
    axios.put('/api/boards', boardObj)
      .then(() => {
        dispatch(editCurrentBoard(boardObj));
      });
  });
}

/** When a user finishes editing a panel's information, putEditedPanel stores the updated information in the database and dispatches an action to edit the currentPanel's properties' state **/
export function putEditedPanel(panelObj) {
  return (dispatch => {
    axios.put('/api/panels', panelObj)
      .then(() => {
        dispatch(editCurrentPanel(panelObj));
      });
  });
}

/** When a user finishes editing a ticket's information, putEditedTicket stores the updated information in the database and dispatches an action to edit the currentTicket's properties' state **/
export function putEditedTicket(ticketObj) {
  return (dispatch => {
    axios.put('/api/tickets', ticketObj)
      .then(() => {
        dispatch(editCurrentTicket(ticketObj));
      });
  });
}
