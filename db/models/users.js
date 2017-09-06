const db = require('../');
const Promise = require('bluebird');

const User = db.Model.extend({
  tableName: 'users',
  memberOfBoards: function() {
    return this.belongsToMany('Board');
  },
  ownedBoards: function() {
    return this.hasMany('Board');
  },
  assignedTickets: function() {
    return this.hasMany('Ticket', 'assignee_id');
  },
  createdTickets: function() {
    return this.hasMany('Ticket', 'creator_id');
  },
  recentBoard: function() {
    return this.belongsTo('Board');
  }
  getUserByUsername: function(username) {
    return User.forge({github_handle: username})
      // {require: true} below?
      .fetch()
      .then(user => {
        if (user) {
          return user.toJSON();
        } else {
          // change to throw?
          return new Promise((resolve, reject) => {
            reject(`User ${user.github_handle} not found!`);
          });
        }
      })
      .error(err => {
        console.log(`Unable to fetch user ${username}: `, err);
        throw err;
      });
  },
  getUsersByBoard: function(boardId) {
    return Board.forge({id: boardId})
      .fetchAll({withRelated: ['users']})
      .then((board) => {
        if (board) {
          let users = board.related('users');
          if (users.length === 0) {
            throw board;
          }
          return users.toJSON();
        } else {
          // change?
          return new Promise((resolve, reject) => {
            reject(`Board ID ${boardId} not found!`);
          });
        }
      })
      .error(err => {
        console.log(`Unable to fetch users for Board ID ${boardId}: `, err);
        throw err;
      })
      .catch(board => {
        console.log(`No users found for board ${board.board_name}`);
        throw board;
      });
  },
  updateUserByUsername: function(username, data) {
    return User.forge({github_handle: username})
      .fetch({require: true})
      .then(user => {
        if (!user) {
          throw data;
        }
        return user.save(data);
        // NOTE: Need to include all fields?
      })
      .then(data => {
        console.log(`User ${data.github_handle} updated!`);
      })
      .error(err => {
        console.log(`Unable to update user ${user.github_handle}: `, err);
        throw err;
      })
      .catch(username => {
        console.log(`User ${username} not found!`);
        throw data;
      });
  },

  // TODO: add user/board membership

  createUser: function(data) {
    return models.User.where({github_handle: data.github_handle})
      .fetch()
      .then((user) => {
        if (user) {
          throw user;
        }
        return User.forge(data).save();
      })
      .then(user => {
        console.log(`User ${data.github_handle} saved!`);
      })
      .error(err => {
        console.log(`Unable to create user ${data.github_handle}: `, err);
        throw err;
      })
      .catch(user => {
        console.log(`User ${user.github_handle} already exists!`);
        throw user;
      });
  }
});

module.exports = db.model('User', User);