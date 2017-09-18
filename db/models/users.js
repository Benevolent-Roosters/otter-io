const db = require('../');
const Promise = require('bluebird');
db.plugin('visibility');

const User = db.Model.extend({
  tableName: 'users',
  hidden: ['api_key'],
  memberOfBoards: function() {
    return this.belongsToMany('Board');
  },
  ownedBoards: function() {
    return this.hasMany('Board', 'owner_id');
  },
  assignedTickets: function() {
    return this.hasMany('Ticket', 'assignee_handle', 'github_handle');
  },
  createdTickets: function() {
    return this.hasMany('Ticket', 'creator_id');
  },
  recentBoard: function() {
    return this.belongsTo('Board', 'lastboard_id');
  },
  invitedToBoards: function() {
    return this.belongsToMany('Board', 'boards_invites', 'invitee_handle', 'board_id', 'github_handle', 'id').withPivot(['id', 'last_email']);
  },
  invites: function() {
    return this.hasMany('Invite', 'invitee_handle', 'github_handle');
  }
});

module.exports = db.model('User', User);