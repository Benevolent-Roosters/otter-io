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
  },
  // TODO: Specify creator/assignee...
  getTicketById: function(ticketId) {
    return Ticket.forge({id: ticketId})
      // {require: true} below?
      .fetch()
      .then(ticket => {
        if (ticket) {
          return ticket.toJSON();
        } else {
          // change to throw?
          return new Promise((resolve, reject) => {
            reject(`Ticket ID ${ticketId} not found!`);
          });
        }
      })
      .error(err => {
        console.log(`Unable to fetch ticket ID ${ticketId}: `, err);
        throw err;
      });
  },
  getTicketsByUser: function(userId) {
    return User.forge({id: userId})
      .fetchAll({withRelated: ['tickets']})
      .then((user) => {
        if (user) {
          let tickets = user.related('tickets');
          if (tickets === 0) {
            throw user;
          }
          return tickets.toJSON();
        } else {
          // change?
          return new Promise((resolve, reject) => {
            reject(`User ID ${userId} not found!`);
          });
        }
      })
      .error(err => {
        console.log(`Unable to fetch tickets for user ID ${userId}: `, err);
        throw err;
      })
      .catch(user => {
        console.log(`No tickets found for user ${user.github_handle}`);
        throw user;
      });
  },
  getTicketsByPanel: function(panelId) {
    return Panel.forge({id: panelId})
      .fetchAll({withRelated: ['tickets']})
      .then((panel) => {
        if (panel) {
          let tickets = panel.related('tickets');
          if (tickets === 0) {
            throw panel;
          }
          return tickets.toJSON();
        } else {
          return new Promise((resolve, reject) => {
            reject(`Panel ID ${panelId} not found!`);
          });
        }
      })
      .error(err => {
        console.log('Unable to fetch tickets for panel ID ${panelId}: ', err);
        throw err;
      })
      .catch(panel => {
        console.log(`No tickets found for panel ${panel.name}`);
        throw user;
      });
  },
  getTicketsByBoard: function(boardId) {
    return Board.forge({id: boardId})
      .fetchAll({withRelated: ['tickets']})
      .then((board) => {
        if (board) {
          let tickets = board.related('tickets');
          return tickets.toJSON();
        } else {
          return new Promise((resolve, reject) => {
            reject(`Board ID ${boardId} not found!`);
          });
        }
      })
      .error(err => console.log('Unable to fetch tickets: ', err));
  },
  updateTicketById: function(ticketId, data) {
    return Ticket.forge({id: ticketId})
      .fetch({require: true})
      .then(ticket => {
        if (!ticket) {
          throw data;
        } else {
          ticket.save(data);
          // NOTE: Need to include all fields?
        }
      })
      .then(ticket => {
        console.log(`Ticket ${data.title} updated!`);
      })
      .error(err => {
        console.log(`Unable to update ticket ID ${ticketId}: `, err);
        throw err;
      })
      .catch(ticketId => {
        console.log(`Panel ID ${ticketId} not found!`);
        throw ticketId;
      });
  },
  createTicket: function(data) {
    return models.Ticket.where({title: data.title})
      .fetch()
      .then((ticket) => {
        if (ticket) {
          throw ticket;
        }
        return ticket.forge(data).save()
          .then(ticket => {
            console.log(`Ticket ${data.name} saved!`);
          })
          .error(err => {
            console.log(`Unable to create ticket ${data.name}: `, err);
            throw err;
          })
          .catch(panel => {
            console.log(`Ticket ${ticket.name} already exists!`);
            throw panel;
          });
      });
  }
});

module.exports = db.model('Ticket', Ticket);