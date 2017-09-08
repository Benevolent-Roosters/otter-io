const db = require('../');
const Promise = require('bluebird');

const Ticket = db.Model.extend({
  tableName: 'tickets',
  board: function() {
    return this.belongsTo('Board');
  },
  panel: function() {
    return this.belongsTo('Panel');
  },
  creator: function() {
    return this.belongsTo('User');
  },
  assignee: function() {
    return this.belongsTo('User');
  }
  // TODO: Specify creator/assignee...
});

module.exports = db.model('Ticket', Ticket);