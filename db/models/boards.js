const db = require('../');
const Promise = require('bluebird');

const Board = db.Model.extend({
  tableName: 'boards',
  users: function() {
    return this.belongsToMany('User');
  },
  owner: function() {
    return this.belongsTo('User');
  },
  tickets: function() {
    return this.hasMany('Ticket');
  },
  panels: function() {
    return this.hasMany('Panel');
  },
  recentUsers: function() {
    return this.hasMany('User');
  },
  getBoardById: function(boardId) {
    return Board.forge({id: boardId})
      // {require: true} below?
      .fetch()
      .then(board => {
        if (board) {
          return board.toJSON();
        } else {
          // change to throw?
          return new Promise((resolve, reject) => {
            reject(`Board ID ${boardId} not found!`);
          });
        }
      })
      .error(err => {
        console.log(`Unable to fetch board ID ${boardId}: `, err);
        throw err;
      });
  },
  getBoardsByUser: function(userId) {
    return User.forge({id: userId})
      .fetchAll({withRelated: ['boards']})
      .then((user) => {
        if (user) {
          let boards = user.related('boards');
          if (boards.length === 0) {
            throw user;
          }
          // change to throw?
          return boards.toJSON();
        } else {
          // change to throw?
          return new Promise((resolve, reject) => {
            reject(`User ID ${userId} not found!`);
          });
        }
      })
      .error(err => {
        console.log(`Unable to fetch boards for user ID ${userId}: `, err);
        throw err;
      })
      .catch(user => {
        console.log(`No boards found for user ${user.github_handle}`);
        throw user;
      });
  },
  updateBoardById: function(boardId, data) {
    return Board.forge({id: boardId})
      .fetch({require: true})
      .then(board => {
        if (!board) {
          throw data;
        } else {
          return board.save(data);
          // NOTE: Need to include all fields?
        }
      })
      .then(board => {
        console.log(`Board ${board.board_name} updated!`);
      })
      .error(err => {
        console.log(`Unable to update board ID ${boardId}: `, err);
        throw err;
      })
      .catch(data => {
        console.log(`Board ID ${boardId} not found!`);
        throw data;
      });
  },
  createBoard: function(data) {
    return models.Board.where({board_name: data.board_name})
      .fetch()
      .then((board) => {
        if (board) {
          throw board;
        }
        return Board.forge(data).save();
      })
      .then(data => {
        console.log(`Board ${data.board_name} saved!`);
      })
      .error(err => {
        console.log(`Unable to create board ${data.board_name}: `, err);
        throw err;
      })
      .catch(board => {
        console.log(`Board ${board.board_name} already exists!`);
        throw board;
      });
      .error(err => {
        console.log('Unable to fetch boards: ', err);
        throw err;
      });
  }
});

module.exports = db.model('Board', Board);