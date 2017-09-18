const db = require('../');

const Invite = db.Model.extend({
  tableName: 'boards_invites',
  invitee: function() {
    return this.belongsTo('User', 'invitee_handle', 'github_handle');
  },

  board: function() {
    return this.belongsTo('Board', 'board_id');
  },
});

module.exports = db.model('Invite', Invite);
