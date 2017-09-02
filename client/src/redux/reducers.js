import { SET_USER, SET_CURRENT_BOARD, SET_BOARDS, SET_PANELS } from './actions';

const defaultState = {
  user: {
    id: 0,
    email: '',
    gitHandle: '',
    profilePicture: ''
  },

  boards: [],

  // {  panelId: int, panelName: '', dueDate: ''  }
  panels: [],

  // {  ticketId: int, ticketTitle: '', ticketDescription: '', asignee: '', status: '', priority: '', ticketType: ''  }
  tickets: [],

  currentBoard: {
    boardId: 0,
    teamName: '',
    repoName: '',
    owner: '',
    repoUrl: ''
  }

};

const rootReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_USER:
      return reduceSetUser(state, action);
    case SET_CURRENT_BOARD:
      return reduceSetCurrentBoard(state, action);
    case SET_BOARDS:
      return reduceSetBoards(state, action);
    case SET_PANELS:
      return reduceSetPanels(state, action);
    default:
      return state;
  }
};

const reduceSetUser = (state, action) => Object.assign({}, state, {user: action.value});

const reduceSetCurrentBoard = (state, action) => Object.assign({}, state, {currentBoard: action.value});

const reduceSetBoards = (state, action) => Object.assign({}, state, {boards: boards.concat(action.value)});

const reduceSetPanels = (state, actions) => Object.assign({}, state, {panels: panels.concat(action.value)});


export default rootReducer;