'use strict';
const express = require('express');
const router = express.Router();
const BoardController = require('../controllers').Boards;
const PanelController = require('../controllers').Panels;
const TicketController = require('../controllers').Tickets;
const middleware = require('../middleware');

var fakeUser = {
  'id': 3,
  'email': null,
  'github_handle': 'dsc03',
  'profile_photo': 'https://avatars0.githubusercontent.com/u/25214199?v=4',
  'oauth_id': '25214199',
  'lastboard_id': null,
  'api_key': 'cat'
};

// Route to get User by API key, API key verification occurs for all routes
router.route('/api_key')
  .get();

// Route to get Board by repo-url
router.route('/board')
  .get(BoardController.getOneBoardByRepoUrl);

// Route to get Panels for a Board
router.route('/panels')
  .get(middleware.auth.verifyBoardMemberElse401, PanelController.getBoardPanels);

// Route to fetch and create new Ticket
router.route('/ticket')
  .get(middleware.auth.verifyBoardMemberElse401, TicketController.getOneTicket)
  .post(middleware.auth.verifyPanelMemberElse401, TicketController.createPanelTicket);

// Route to get Tickets for a User and update existing Tickets
router.route('/tickets')
  .get(middleware.auth.verifyBoardMemberElse401, TicketController.getUserTicketsByBoard)
  .put(middleware.auth.verifyPanelMemberElse401, TicketController.updateTicket);

// Route to get Tickets for a Panel
router.route('/panel/tickets')
  .get(middleware.auth.verifyBoardMemberElse401, TicketController.getPanelTickets);

// Route to get my Tickets for a Panel
router.route('/mypaneltickets')
  .get(middleware.auth.verifyBoardMemberElse401, TicketController.getPanelTicketsByUser);

// Fake route to get board by repo url
router.route('/fake/board')
  .get(BoardController.getOneBoardByRepoUrl);

// Fake route to get board by repo url
router.route('/fake/mypaneltickets')
  .get(middleware.auth.verifyBoardMemberElse401, TicketController.getPanelTicketsByUser);

// Fake route to get Panels for a Board
router.route('/fake/panels')
  .get(middleware.auth.verifyBoardMemberElse401, PanelController.getBoardPanels);

// Fake route to fetch and create new Ticket
router.route('/fake/ticket')
  .get(middleware.auth.verifyBoardMemberElse401, TicketController.getOneTicket)
  .post(middleware.auth.verifyPanelMemberElse401, TicketController.createPanelTicket);

// Fake route to get Tickets for a User and update existing Tickets
router.route('/fake/tickets')
  .get(middleware.auth.verifyBoardMemberElse401, TicketController.getUserTicketsByBoard)
  .put(middleware.auth.verifyPanelMemberElse401, TicketController.updateTicket);

module.exports = router;
