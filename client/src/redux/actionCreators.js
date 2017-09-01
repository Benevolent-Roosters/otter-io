import { SET_USER, SET_CURRENT_BOARD, SET_BOARDS, SET_PANELS } from './actions';

export function handleUser(user) {
  return {type: SET_USER, value: user};
};

export function setCurrentBoard(clickedBoard) {
  return {type: SET_CURRENT_BOARD, value: clickedBoard};
};

export function setPanels(panels) {
  return {type: SET_PANELS, value: panels};
};

export function setBoards(newBoard) {
  return {type: SET_BOARDS, value: newBoard};
 };
