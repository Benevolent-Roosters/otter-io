import { SET_USER, SET_CURRENT_BOARD, SET_BOARDS, SET_PANELS, SET_TICKETS, EDIT_CURRENT_BOARD, EDIT_BOARDS, EDIT_PANELS, EDIT_CURRENT_PANEL } from './actions';

const defaultState = {
  user: {

  },

  boards: [],

  panels: [],

  tickets: [],

  currentBoard: {

  },

  currentTicket: {

  },

  currentPanel: {

  }

};

const rootReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_USER:
      return reduceSetUser(state, action);
    case SET_CURRENT_BOARD:
      return reduceSetCurrentBoard(state, action);
    case SET_CURRENT_PANEL:
      return reduceSetCurrentPanel(state, action);
    case SET_BOARDS:
      return reduceSetBoards(state, action);
    case SET_PANELS:
      return reduceSetPanels(state, action);
    case SET_TICKETS:
      return reduceSetTickets(state, action);
    case EDIT_BOARDS:
      return reduceEditBoards(state, action);
    case EDIT_CURRENT_BOARD:
      return reduceEditCurrentBoard(state, action);
    case EDIT_PANELS:
      return reduceEditPanels(state, action);
    case EDIT_CURRENT_PANEL:
      return reduceEditCurrentPanel(state, action);
    default:
      return state;
  }
};

const reduceSetUser = (state, action) => Object.assign({}, state, {user: action.value});

const reduceSetCurrentBoard = (state, action) => Object.assign({}, state, {currentBoard: action.value});

const reduceSetCurrentPanel = (state, action) => Object.assign({}, state, {currentPanel: action.value});

const reduceSetBoards = (state, action) => Object.assign({}, state, {boards: boards.concat(action.value)});

const reduceSetPanels = (state, action) => Object.assign({}, state, {panels: panels.concat(action.value)});

const reduceSetTickets = (state, action) => Object.assign({}, state, {tickets: tickets.concat(action.value)});

const reduceEditBoards = (state, action) => Object.assign({}, state, {boards: action.value});

const reduceEditCurrentBoard = (state, action) => Object.assign({}, state, {currentBoard: action.value});

const reduceEditCurrentPanel = (state, action) => Object.assign({}, state, {currentPanel: action.value});

const reduceEditPanels = (state, action) => Object.assign({}, state, {panels: action.value});

export default rootReducer;