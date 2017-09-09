const models = require('../../db/models');
const dbhelper = require('../../db/helpers.js');
const helper = require('./helper');

module.exports.getUserOwnedBoards = (req, res) => {
  if (helper.checkUndefined(req.body.owner_id)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  //req.body.owner_id used to be req.params.owner_id but axios GET can only get it into req.body
  models.Board.where({ owner_id: req.body.owner_id }).fetch()
    .then(boards => {
      if (!boards) {
        throw 'cant get boards that user owns';
      }
      res.status(200).send(boards);
    })
    .catch(err => {
      // This code indicates an outside service (the database) did not respond in time
      res.status(500).send(JSON.stringify(err));
    });
};

module.exports.getMyBoards = (req, res) => {
  var userId = req.user.id;
  dbhelper.getBoardsByUser(userId)
    .then(boards => {
      if (!boards) {
        throw 'user doesnt have any boards';
      }
      res.status(200).send(boards);
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
};

module.exports.createMyBoard = (req, res) => {
  if (helper.checkUndefined(req.body.board_name, req.body.repo_name, req.body.repo_url, req.body.owner_id)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  if (parseInt(req.body.owner_id) !== req.user.id) {
    res.status(400).send('owner_id field from client doesnt match actual logged in user');
    return;
  }
  var boardObj = {
    board_name: req.body.board_name,
    repo_name: req.body.repo_name,
    repo_url: req.body.repo_url,
    owner_id: req.user.id
  };
  var createdBoard;
  dbhelper.createBoard(boardObj)
    .then(result => {
      if (!result) {
        throw 'could not create board';
      }
      createdBoard = result;
      return dbhelper.addUserToBoard(req.user.id, result.id);
    })
    .then(result => {
      if (!result) {
        throw 'could not register user for the board';
      }
      res.status(201).send(createdBoard);
    })
    .catch(err => {
      res.status(500).send(JSON.stringify(err));
    });
};

module.exports.getOneBoard = (req, res) => {
  if (helper.checkUndefined(req.params.id)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  var boardId = req.params.id;
  dbhelper.getBoardById(boardId)
    .then(board => {
      if (!board) {
        throw 'could not get board';
      }
      res.status(200).send(board);
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
};

module.exports.updateBoard = (req, res) => {
  if (helper.checkUndefined(req.body)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  var updateBoardObj = req.body;
  var validKeys = {
    'id': true,
    'board_name': true,
    'repo_name': true,
    'repo_url': true,
    'owner_id': true
  };
  for (var key in updateBoardObj) {
    if (updateBoardObj.hasOwnProperty(key)) {
      if (!(key in validKeys)) {
        res.status(400).send(`${key} not a valid field`);
        return;
      }
    }
  }
  var boardId = updateBoardObj.id;
  if (!boardId) {
    res.status(400).send(`Update board object ${JSON.stringify(updateBoardObj)} doesnt have id field`);
    return;
  }
  dbhelper.updateBoardById(boardId, updateBoardObj)
    .then((board) => {
      if (!board) {
        throw 'could not update board obj';
      }
      res.status(201).send(board);
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
};

module.exports.getUsersByBoard = (req, res) => {
  if (helper.checkUndefined(req.params.id)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  var boardId = req.params.id;
  dbhelper.getUsersByBoard(boardId)
    .then((users) => {
      if (!users) {
        throw 'couldnt get users for board';
      }
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
};

module.exports.addMember = (req, res) => {
  if (helper.checkUndefined(req.params.id, req.body.user_id)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  var userId = req.body.user_id;
  var boardId = req.params.id;
  dbhelper.addUserToBoard(userId, boardId)
    .then(member => {
      if (!member) {
        throw 'couldnt add user to board';
      }
      res.status(201).send(member);
    })
    .catch(err => {
      res.status(500).send(JSON.stringify(err));
    });
};
