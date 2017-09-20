const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('redis').createClient('6379', 'localhost');
const models = require('../../db/models');
const dbhelper = require('../../db/helpers.js');
const helper = require('../controllers/helper');


console.log(redisClient);
//for testing purposes to set up a fake login session
module.exports.fakemiddleware = (req, res, next) => {
  if (req && req.session && req.session.user_tmp) {
    req.user = req.session.user_tmp;
  }
  if (next) {
    next();
  }
};

module.exports.verify = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

module.exports.verifyElse401 = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
};

module.exports.verifyAPIKey = (req, res, next) => {
  if (!req.params && !req.body && !req.query) {
    res.status(400).send('API key could not be found in request');
  }

  let apiKey;

  // LOCATE API KEY
  if (req.query.api_key) {
    apiKey = req.query.api_key;
  } else {
    apiKey = req.body.api_key;
  }

  dbhelper.getUserByApiKey(apiKey)

    .then(user => {
      if (!user) {
        return res.status(401).send();
      } else if (Object.keys(req.query).length === 1 && (req.query.hasOwnProperty('api_key'))) {

        let userInfo = {id: user.id, github_handle: user.github_handle, api_key: apiKey, board_id: req.query.board_id};

        return res.status(200).send(JSON.stringify(userInfo));
      } else { /** IF REQUEST WAS NOT SPECIFICALLY FOR API_KEY VERIFICATION **/
        return next();
      }
    })
    .error(err => {
      res.status(500).send();
    })
    .catch(err => {
      res.status(404).send(JSON.stringify(err));
    });
};

//to be used as middleware auth before performing BOARD CRUD api croutes
module.exports.verifyBoardMemberElse401 = (req, res, next) => {
  var boardid;
  // console.log('query:', req.query);
  if (!req.params && !req.body && !req.query) {
    res.status(400).send('board id couldnt be found in request from client');
  }
  if (req.params && req.params.id) {
    boardid = parseInt(req.params.id);
  } else if (req.body && req.body.id) {
    boardid = parseInt(req.body.id);
  } else {
    boardid = parseInt(req.query.board_id);
  }
  var userId = req.user ? req.user.id : req.query.user_id;

  //see whether the boardid shows up under any of the users boards
  dbhelper.getBoardsByUser(parseInt(userId))
    .then(boards => {
      if (!boards) {
        throw 'user doesnt have any boards';
      }
      return boards.filter((eachBoard) => {
        return eachBoard.id === boardid;
      });
    })

    .then(function(results) {
      if (results.length === 0) {
        res.status(401).send();
      } else {
        return next();
      }
    })
    .error(err => {
      res.status(500).send();
    })
    .catch(err => {
      res.status(404).send(JSON.stringify(err));
    });
};

//to be used as middleware auth before performing BOARD CRUD api croutes
module.exports.verifyBoardOwnerElse401 = (req, res, next) => {
  var boardid;
  if (!req.params && !req.body) {
    res.status(400).send('board id couldnt be found in request from client');
  }
  if (req.body && req.body.board_id) {
    boardid = parseInt(req.body.board_id);
  } else if (req.body && req.body.id) {
    boardid = parseInt(req.body.id);
  } else {
    boardid = parseInt(req.params.id);
  }
  var userId = req.user.id;
  //see whether the boardid's shows up under any of the users boards
  dbhelper.getBoardById(parseInt(boardid))
    .then(function(board) {
      if (!board) {
        throw board;
      }
      return board.owner_id === userId;
    })
    .then(ownsBoard => {
      if (!ownsBoard) {
        res.status(401).send();
      } else {
        return next();
      }
    })
    .error(err => {
      res.status(500).send();
    })
    .catch(err => {
      res.status(404).send(JSON.stringify(err));
    });
};

//to be used as middleware auth before performing a specific GET PANEL apir route or some TICKET CRUD api routes
module.exports.verifyPanelMemberElse401 = (req, res, next) => {
  var panelid;
  if (!req.query && !req.body && !req.params) {
    res.status(400).send('panel id couldnt be found in request from client');
  }
  if (req.query && req.query.panel_id) {
    panelid = parseInt(req.query.panel_id);
  } else if (req.body && req.body.panel_id) {
    panelid = parseInt(req.body.panel_id);
  } else {
    panelid = parseInt(req.params.id);
  }
  var userId = req.user.id;

  //see whether the user belongs to panelid's board
  helper.checkIfMemberOfPanelId(userId, panelid)
    .then(boolean => {
      if (!boolean) {
        res.status(401).send();
      } else {
        return next();
      }
    })
    .error(err => {
      res.status(500).send();
    })
    .catch(err => {
      res.status(404).send(JSON.stringify(err));
    });
};

//to be used as middleware auth before performing GET particular TICKET route
module.exports.verifyTicketMemberElse401 = (req, res, next) => {
  var ticketid;
  if (!req.params && !req.body) {
    res.status(400).send('ticket id couldnt be found in request from client');
  }
  if (!req.params || !req.params.id) {
    ticketid = parseInt(req.body.id);
  } else {
    ticketid = parseInt(req.params.id);
  }
  var userId = req.user.id;
  //see whether the ticketid's shows up under any of the users boards
  dbhelper.getTicketById(parseInt(ticketid))
    .then((ticket) => {
      if (!ticket) {
        throw ticket;
      }
      return helper.checkIfMemberOfBoardId(userId, ticket.board_id);
    })
    .then(boardmember => {
      if (!boardmember) {
        res.status(401).send();
      } else {
        return next();
      }
    })
    .error(err => {
      res.status(500).send();
    })
    .catch(err => {
      res.status(404).send(JSON.stringify(err));
    });
};

//to be used as middleware auth before performing Invite accept/reject api croutes
module.exports.verifyBoardOwnerOrInviteeElse401 = (req, res, next) => {
  var boardid, boardOwnerID;
  if (!req.params) {
    res.status(400).send('board id couldnt be found in request from client');
  }
  if (!req.body && !(req.body.user_id || req.body.user_emails)) {
    res.status(400).send('invitee couldnt be found in request from client');
  }
  if (req.params && req.params.id) {
    boardid = parseInt(req.params.id);
  }
  var userId = req.user.id;
  //see whether the boardid's shows up under any of the users owned boards or invite list
  dbhelper.getBoardById(parseInt(boardid))
    .then(board => {
      if (!board) {
        throw board;
      }
      boardOwnerID = board.owner_id;
      return dbhelper.getInviteesByBoard(boardid);
    })
    .then(invitees => {
      var isInvitee = false;
      if (req.body.user_id && req.body.user_id === userId) {
        for (var i = 0; i < invitees.length; i++) {
          if (invitees[i].id === req.body.user_id) {
            isInvitee = true;
            break;
          }
        }
      } else if (req.body.user_emails && req.body.user_emails.length === 1 && req.body.user_emails[0] === req.user.email) {
        for (var i = 0; i < invitees; i++) {
          if (invitees[i].email === req.body.user_emails[0]) {
            isInvitee = true;
            break;
          }
        }
      }
      // if (isInvitee) {
      //   console.log(`User ${userId} is invitee of this board ${boardid}`);
      // }
      // if (boardOwnerID === userId) {
      //   console.log(`User ${userId} is owner of this board ${boardid}`);
      // }
      return isInvitee || (boardOwnerID === userId);
    })
    .then(ownsOrInvitedToBoard => {
      if (!ownsOrInvitedToBoard) {
        res.status(401).send();
      } else {
        return next();
      }
    })
    .error(err => {
      res.status(500).send();
    })
    .catch(err => {
      res.status(404).send(JSON.stringify(err));
    });
};

module.exports.session = session({
  store: new RedisStore({
    client: redisClient
  }),
  secret: 'more laughter, more love, more life',
  resave: false,
  saveUninitialized: false
});