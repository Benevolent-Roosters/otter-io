const dbhelper = require('../../db/helpers.js');
const Panel = require('../../db/models/panels.js');

module.exports.checkUndefined = (...args) => {
  var anyUndefined = false;
  args.forEach((eachInput) => {
    if (eachInput === undefined) {
      anyUndefined = true;
    }
  });
  return anyUndefined;
};

module.exports.checkIfMemberOfBoardId = (userId, boardId) => {
  return dbhelper.getUsersByBoard(parseInt(boardId))
    .then(users => {
      if (!users) {
        throw users;
      }
      var userMatch = false;
      users.forEach(eachUser => {
        if (eachUser.id === userId) {
          userMatch = true;
        }
      });
      return userMatch;
    });
};

module.exports.checkIfEmailMemberOfBoardId = (email, boardId) => {
  return dbhelper.getUsersByBoard(parseInt(boardId))
    .then(users => {
      if (!users) {
        throw users;
      }
      var userMatch = false;
      users.forEach(eachUser => {
        if (eachUser.email === email) {
          userMatch = true;
        }
      });
      return userMatch;
    });
};

module.exports.checkIfOwnerOfBoardId = (userId, boardId) => {
  return dbhelper.getBoardById(parseInt(boardId))
    .then(board => {
      if (!board) {
        throw board;
      }
      return board.owner_id === userId;
    });
};

module.exports.checkIfMemberOfPanelId = (userId, panelId) => {
  return Panel.forge({id: panelId})
    .fetch()
    .then(panel => {
      if (!panel) {
        throw panelId; 
      }
      return panel.toJSON();
    })
    .then(panel => {
      return module.exports.checkIfMemberOfBoardId(userId, panel.board_id);
    })
    .error(err => {
      console.log('Unexpected error ', err);
      throw err;
    })
    .catch(err => {
      console.log('Something happened retrieving panelId, etc.');
      throw err;
    });
};
