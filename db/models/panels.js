const db = require('../');
const Promise = require('bluebird');

const Panel = db.Model.extend({
  tableName: 'panels',
  board: function() {
    return this.belongsTo('Board');
  },
  tickets: function() {
    return this.hasMany('Ticket');
  }
});

module.exports = db.model('Panel', Panel);