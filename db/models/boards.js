const db = require('../');
const Promise = require('bluebird');

const Board = db.Model.extend({
  tableName: 'boards',
  users: function() {
    return this.belongsToMany('User');
  },
  owner: function() {
    return this.belongsTo('User', 'owner_id');
  },
  tickets: function() {
    return this.hasMany('Ticket');
  },
  panels: function() {
    return this.hasMany('Panel');
  },
  recentUsers: function() {
    return this.hasMany('User', 'lastboard_id');
  },
  invitedHandles: function() {
    return this.belongsToMany('User', 'boards_invites', 'board_id', 'invitee_handle', 'id', 'github_handle').withPivot(['id', 'last_email']);
  },
  invites: function() {
    return this.hasMany('Invite');
  }
});

module.exports = db.model('Board', Board);