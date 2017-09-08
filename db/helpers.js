const db = require('./');
const Promise = require('bluebird');
const User = require('./models/users.js');
const Board = require('./models/boards.js');
const Panel = require('./models/panels.js');
const Ticket = require('./models/tickets.js');

// Functions are in the following order:

// createUser
// getUserById
// updateUserById

// addUserToBoard
// getUsersByBoard
// getBoardsByUser

// createBoard
// getBoardById
// updateBoardById

// createPanel
// getPanelById
// getPanelsByBoard
// updatePanelById

// createTicket
// getTicketById
// getTicketsByUser
// getTicketsByPanel
// getTicketsByBoard
// updateTicketById

module.exports.createUser = function(data) {
  return User.where({github_handle: data.github_handle})
    .fetch()
    .then((user) => {
      if (user) {
        throw user;
      }
      return User.forge(data).save();
    })
    .then(user => {
      console.log(`User ${user.github_handle} saved!`);
      return user.toJSON();
    })
    .error(err => {
      console.log('Unable to create user', err);
      throw err;
    })
    .catch(user => {
      console.log(`User ${user.github_handle} already exists!`);
      throw user;
    });
};

module.exports.getUserById = function(userId) {
  return User.forge({id: userId})
    .fetch()
    .then(user => {
      if (!user) {
        throw userId;
      }
      return user.toJSON();
    })
    .error(err => {
      console.log('Unable to fetch user', err);
      throw err;
    })
    .catch(userId => {
      console.log(`User ID ${userId} not found! Sad!`);
      throw userId;
    });
};

module.exports.updateUserById = function(userId, data) {
  return User.forge({id: userId})
    .fetch()
    .then(user => {
      if (!user) {
        throw userId;
      }
      return user.save(data);
    })
    .then(user => {
      console.log(`User ${user.toJSON().github_handle} updated!`);
      return user.toJSON();
    })
    .error(err => {
      console.log('Unable to update user', err);
      throw err;
    })
    .catch(userId => {
      console.log(`User ID ${userId} not found!`);
      throw userId;
    });
};

module.exports.addUserToBoard = function(userId, boardId) {
  return User.forge({id: userId})
    // .fetchAll({withRelated: ['boards']})
    .fetch({withRelated: ['memberOfBoards']})
    .then(user => {
      let boardIds = user.related('memberOfBoards').toJSON().map(membership => membership.id);
      if (boardIds.includes(boardId)) {
        throw user;
      }
      return user.memberOfBoards().attach(boardId);
    })
    .then((result) => {
      console.log(`User ID ${userId} added to boardId ${boardId}`);
      return result.toJSON();
    })
    .error(err => {
      console.log('Unable to add user to board');
      throw err;
    })
    .catch(user => {
      console.log(`User ${user.toJSON().github_handle} already belongs to board ID ${boardId}`);
      throw user;
    });
};

module.exports.getUsersByBoard = function(boardId) {
  return Board.forge({id: boardId})
    // .fetchAll({withRelated: ['boards']})
    .fetch()
    .then(board => {
      if (board) {
        return board.related('users').fetch();
      } else {
        return new Promise((resolve, reject) => {
          reject(`Board ID ${boardId} not found!`);
        });
      }
    })
    .then((users) => {
      if (users.length === 0) {
        throw users;
      }
      return users.toJSON();
    })
    .error(err => {
      console.log(`Unable to fetch users for Board ID ${boardId}: `, err);
      throw err;
    })
    .catch(users => {
      console.log(`No users found for that board. Try again!`);
      throw users;
    });
};

module.exports.getBoardsByUser = function(userId) {
  return User.forge({id: userId})
    // .fetchAll({withRelated: ['boards']})
    .fetch()
    .then(user => {
      if (user) {
        return user.related('memberOfBoards').fetch();
      } else {
        return new Promise((resolve, reject) => {
          reject(`User ID ${userId} not found!`);
        });
      }
    })
    .then((boards) => {
      if (boards.length === 0) {
        throw boards;
      }
      return boards.toJSON();
    })
    .error(err => {
      console.log(`Unable to fetch boards for User ID ${userId}: `, err);
      throw err;
    })
    .catch(boards => {
      console.log('No boards found for that user!');
      throw boards;
    });
};

module.exports.createBoard = function(data) {
  return Board.where({board_name: data.board_name})
    .fetch()
    .then((board) => {
      if (board) {
        throw board;
      }
      return Board.forge(data).save();
    })
    .then(board => {
      console.log(`Board ${board.board_name} saved!`);
      return board.toJSON();
    })
    .error(err => {
      console.log('Unable to create board', err);
      throw err;
    })
    .catch(board => {
      console.log(`Board ${board.board_name} already exists!`);
      throw board;
    });
};

module.exports.getBoardById = function(boardId) {
  return Board.forge({id: boardId})
    .fetch()
    .then(board => {
      if (board) {
        return board.toJSON();
      }
      throw boardId;
    })
    .error(err => {
      console.log('Unable to fetch board', err);
      throw err;
    })
    .catch(boardId => {
      console.log(`Board ID ${boardId} not found! Sad!`);
      throw boardId;
    });
};

module.exports.updateBoardById = function(boardId, data) {
  return Board.forge({id: boardId})
    .fetch()
    .then(board => {
      if (!board) {
        throw boardId;
      }
      return board.save(data);
    })
    .then(board => {
      console.log(`Board ${board.toJSON().board_name} updated!`);
      return board.toJSON();
    })
    .error(err => {
      console.log('Unable to update board', err);
      throw err;
    })
    .catch(boardId => {
      console.log(`Board ID ${boardId} not found! Sad!`);
      throw boardId;
    });
};

module.exports.createPanel = function(data) {
  return Board.forge({id: data.board_id})
    .fetch({withRelated: ['panels']})
    .then(board => {
      let panelNames = board.related('panels').toJSON().map(panel => panel.name);
      if (panelNames.includes(data.name)) {
        throw data;
      }
      return Panel.forge(data).save();
    })
    .then(panel => {
      console.log(`Panel ${panel.toJSON().name} saved!`);
      return panel.toJSON();
    })
    .error(err => {
      console.log('Unable to create panel', err);
      throw err;
    })
    .catch(data => {
      console.log(`Board already contains a panel named ${data.name}!`);
      throw data;
    });
};

module.exports.getPanelById = function(panelId) {
  return Panel.forge({id: panelId})
    .fetch()
    .then(panel => {
      if (!panel) {
        throw panelId; 
      }
      return panel.toJSON();
    })
    .error(err => {
      console.log('Unable to fetch panel', err);
      throw err;
    })
    .catch(panelId => {
      console.log(`Panel ID ${panelId} not found! Sad!`);
      throw panelId;
    });
};

module.exports.getPanelsByBoard = function(boardId) {
  return Board.forge({id: boardId})
    .fetch({withRelated: ['panels']})
    .then(board => {
      if (board) {
        let panels = board.related('panels');
        if (panels.length === 0) {
          throw board;
        }
        return panels.toJSON();
      } else {
        return new Promise((resolve, reject) => {
          reject(`Board ID ${boardId} not found!`);
        });
      }
    })
    .error(err => {
      console.log('Unable to fetch panels', err);
      throw err;
    })
    .catch(board => {
      console.log(`No panels found for board ${board.board_name}`);
      throw board;
    });
};

module.exports.updatePanelById = function(panelId, data) {
  return Panel.forge({id: panelId})
    .fetch()
    .then(panel => {
      if (!panel) {
        throw panelId;
      }
      return panel.save(data);
    })
    .then(panel => {
      console.log(`Panel ${panel.toJSON().name} updated!`);
      return panel.toJSON();
    })
    .error(err => {
      console.log('Unable to update panel', err);
      throw err;
    })
    .catch(panelId => {
      console.log(`Panel ID ${panelId} not found! Sad!`);
      throw panelId;
    });
};

module.exports.createTicket = function(data) {
  return Panel.forge({id: data.panel_id})
    .fetch({withRelated: 'tickets'})
    .then(panel => {
      let ticketTitles = panel.related('tickets').toJSON().map(ticket => ticket.title);
      if (ticketTitles.includes(data.title)) {
        throw data;
      }
      return Ticket.forge(data).save();
    })
    .then(ticket => {
      console.log(`Ticket ${ticket.toJSON().title} saved!`);
      return ticket.toJSON();
    })
    .error(err => {
      console.log('Unable to create ticket', err);
      throw err;
    })
    .catch(data => {
      console.log(`Panel already contains a ticket titled ${data.title}!`);
      throw data;
    });
};

module.exports.getTicketById = function(ticketId) {
  return Ticket.forge({id: ticketId})
    .fetch()
    .then(ticket => {
      if (!ticket) {
        throw ticketId;
      }
      return ticket.toJSON();
    })
    .error(err => {
      console.log('Unable to fetch ticket', err);
      throw err;
    })
    .catch(ticketId => {
      console.log(`Ticket ID ${ticketId} not found! Sad!`);
      throw ticketId;
    });
};

module.exports.getTicketsByUser = function(userId) {
  return User.forge({id: userId})
    .fetch({withRelated: ['assignedTickets']})
    .then((user) => {
      if (user) {
        let tickets = user.related('assignedTickets');
        if (tickets === 0) {
          throw user;
        }
        return tickets.toJSON();
      } else {
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
      console.log(`No tickets found for user ${user.toJSON().github_handle}`);
      throw user;
    });
};

module.exports.getTicketsByPanel = function(panelId) {
  return Panel.forge({id: panelId})
    .fetch({withRelated: [{ tickets: function(query) { query.orderBy('status', 'DESC').orderBy('priority', 'DESC'); }}]})
    .then((panel) => {
      if (panel) {
        let tickets = panel.related('tickets');
        if (tickets.length === 0) {
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
      console.log('Unable to fetch tickets', err);
      throw err;
    })
    .catch(panel => {
      console.log(`No tickets found for panel ${panel.toJSON().name}`);
      throw panel;
    });
};

// Not being used, may need to be updated
module.exports.getTicketsByBoard = function(boardId) {
  return Board.forge({id: boardId})
    .fetch({withRelated: ['tickets']})
    .then((board) => {
      if (board) {
        let tickets = board.related('tickets');
        if (tickets.length === 0) {
          throw board;
        }
        return tickets.toJSON();
      } else {
        return new Promise((resolve, reject) => {
          reject(`Board ID ${boardId} not found!`);
        });
      }
    })
    .error(err => {
      console.log('Unable to fetch tickets', err);
      throw err;
    })
    .catch(board => {
      console.log(`No tickets found for board ${board.toJSON().board_name}`);
      throw board;
    });
};

module.exports.updateTicketById = function(ticketId, data) {
  return Ticket.forge({id: ticketId})
    .fetch()
    .then(ticket => {
      if (!ticket) {
        throw ticketId;
      }
      return ticket.save(data);
    })
    .then(ticket => {
      console.log(`Ticket ${ticket.toJSON().title} updated!`);
      return ticket.toJSON();
    })
    .error(err => {
      console.log('Unable to update ticket', err);
      throw err;
    })
    .catch(ticketId => {
      console.log(`Ticket ID ${ticketId} not found! Sad!`);
      throw ticketId;
    });
};