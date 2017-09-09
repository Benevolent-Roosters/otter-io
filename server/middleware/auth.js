const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('redis').createClient();
const models = require('../../db/models');
const dbhelper = require('../../db/helpers.js');

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

module.exports.verifyBoardMemberElse401 = (req, res, next) => {
  var boardid;
  if (!req.params && !req.body) {
    res.status(400).send('board id couldnt be found in request from client');
  }
  if (!req.params.id) {
    boardid = parseInt(req.body.id);
  } else {
    boardid = parseInt(req.params.id);
  }
  var userId = req.user.id;

  // return models.User.where({ id: userId }).fetch({withRelated:['memberOfBoards']})
  // .then(function(user) {
  //   return user.related('memberOfBoards');
  // })

  //see whether the boardid shows up under any of the users boards
  dbhelper.getBoardsByUser(userId)
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

module.exports.verifyBoardOwnerElse401 = (req, res, next) => {
  var boardid;
  if (!req.params && !req.body) {
    res.status(400).send('board id couldnt be found in request from client');
  }
  if (!req.params.id) {
    boardid = parseInt(req.body.id);
  } else {
    boardid = parseInt(req.params.id);
  }
  var userId = req.user.id;
  //see whether the boardid's shows up under any of the users boards
  dbhelper.getBoardById(boardid)
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

module.exports.session = session({
  store: new RedisStore({
    client: redisClient,
    host: 'localhost',
    port: 6379
  }),
  secret: 'more laughter, more love, more life',
  resave: false,
  saveUninitialized: false
});