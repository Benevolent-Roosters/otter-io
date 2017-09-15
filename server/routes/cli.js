'use strict';
const express = require('express');
const router = express.Router();
const BoardController = require('../controllers').Boards;
const PanelController = require('../controllers').Panels;
const TicketController = require('../controllers').Tickets;
const middleware = require('../middleware');


//Route to get User by API key
router.route('/api_key')
.get(middleware.auth.verifyAPIKey);

//Route to get Board by repo-url
router.route('/board')
.get()

module.exports = router;
