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
    return this.hasMany('Ticket');
  },
  createdTickets: function() {
    return this.hasMany('Ticket');
  }
});

module.exports = db.model('User', User);