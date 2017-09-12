'use strict';
const express = require('express');
const router = express.Router();
const BoardController = require('../controllers').Boards;
const PanelController = require('../controllers').Panels;
const TicketController = require('../controllers').Tickets;
const middleware = require('../middleware');

router.route('/')
  .get((req, res) => {
    res.status(200).send('Hello World!');
  })
  .post((req, res) => {
    console.log('in the correct route');
    res.status(201).send({ data: 'Posted!' });
  });

//Get all of My boards, or Create, update a board
router.route('/boards')
  .get(BoardController.getMyBoards)
  //and later distinguish the boards that the user actually owns by calling helper BoardController.getUserOwnedBoards
  .post(BoardController.createMyBoard)
  .put(middleware.auth.verifyBoardOwnerElse401, BoardController.updateBoard); //only if owner of board

//Get, Delete particular Board
router.route('/boards/:id')
  .get(middleware.auth.verifyBoardMemberElse401, BoardController.getOneBoard); //only if member of board
//  .delete(BoardController.deleteOne) //only if owner of board
//  //also delete all of board's tickets, panels, and everything from boards_users, and all user's lastboard_id???

//Get, Add, Remove people from Board
router.route('/boards/:id/members')
  .get(middleware.auth.verifyBoardMemberElse401, BoardController.getUsersByBoard) //only if member of board
  .post(middleware.auth.verifyBoardOwnerElse401, BoardController.addMember); //only if owner of board
//  .delete(middleware.auth.verifyBoardOwnerElse401, BoardController.delmember) //only if owner of board

//Request to join a board
//router.route('/boards/:id/requestjoin')
//Leave a board
//router.route('/boards/:id/leave') //only if member of board

router.route('/panels')
  .get(middleware.auth.verifyBoardMemberElse401, PanelController.getBoardPanels) //only if member of board
  .post(middleware.auth.verifyBoardOwnerElse401, PanelController.createBoardPanel) //only if owner of board
  .put(middleware.auth.verifyBoardOwnerElse401, PanelController.updatePanel); //only if owner of board

router.route('/panels/:id')
  .get(middleware.auth.verifyPanelMemberElse401, PanelController.getOnePanel); //only if member of board
//  .delete(middleware.auth.verifyPanelMemberElse401, PanelController.deleteOne) //only if owner of board
//  //also delete all of panel's tickets???

router.route('/tickets')
  .get(middleware.auth.verifyPanelMemberElse401, TicketController.getPanelTickets) //only if member of board
  .post(middleware.auth.verifyPanelMemberElse401, TicketController.createPanelTicket) //only if member of board
  .put(middleware.auth.verifyPanelMemberElse401, TicketController.updateTicket); //only if member of board

router.route('/tickets/:id')
  .get(middleware.auth.verifyTicketMemberElse401, TicketController.getOneTicket); //only if member of board
//  .delete(middleware.auth.verifyTicketMemberElse401, TicketController.deleteOne) //only if owner of board

module.exports = router;