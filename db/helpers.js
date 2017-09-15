const db = require('./');
const Promise = require('bluebird');
const User = require('./models/users.js');
const Board = require('./models/boards.js');
const Panel = require('./models/panels.js');
const Ticket = require('./models/tickets.js');

// Functions are in the following order:

// createUser
// getUserById
// getUserByApiKey
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
// updateTicketById

module.exports.createUser = function(data) {
  return User.where({github_handle: data.github_handle})
    .fetch()
    .then((user) => {
      if (user) {
        throw 'duplicate user';
      }
      return User.forge(data).save();
    })
    .then(user => {
      console.log(`User ${user.toJSON().github_handle} saved!`);
      return user.toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: user ${data.github_handle} already exists!`);
      throw situation;
    });
};

module.exports.getUserById = function(userId) {
  return User.forge({id: userId})
    .fetch()
    .then(user => {
      if (!user) {
        throw 'invalid user';
      }
      return user.toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: user ID ${userId} does not exist!`);
      throw situation;
    });
};

module.exports.getUserByApiKey = function(apiKey) {
  return User.forge({api_key: apiKey})
    .fetch()
    .then(user => {
      if (!user) {
        throw 'invalid user';
      }
      return user.toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: user API key does not exist!`);
      throw situation;
    });
};

module.exports.updateUserById = function(userId, data) {
  return User.forge({id: userId})
    .fetch()
    .then(user => {
      if (!user) {
        throw 'invalid user';
      }
      return user.save(data);
    })
    .then(user => {
      console.log(`User ${user.toJSON().github_handle} updated!`);
      return user.toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: user ID ${userId} doesn't exist!`);
      throw situation;
    });
};

module.exports.addUserToBoard = function(userId, boardId) {
  return Board.forge({id: boardId})
    .fetch()
    .then(board => {
      if (!board) {
        throw 'invalid board';
      }
      return User.forge({id: userId}).fetch({withRelated: ['memberOfBoards']});
    })
    .then(user => {
      if (!user) {
        throw 'invalid user';
      }
      let boardIds = user.related('memberOfBoards').toJSON().map(membership => membership.id);
      if (boardIds.includes(boardId)) {
        throw 'duplicate membership';
      }
      return user.memberOfBoards().attach(boardId);
    })
    .then(result => {
      return result.toJSON();
    })
    .catch(situation => {
      if (situation === 'invalid board') {
        console.log(`There is a situation: board ID ${boardId} doesn't exist!`);
      }
      if (situation === 'invalid user') {
        console.log(`There is a situation: user ID ${userId} doesn't exist!`);
      }
      if (situation === 'duplicate membership') {
        console.log(`There is a situation: user ID ${userId} already belongs to board ID ${boardId}!`);
      }
      throw situation;
    });
};

module.exports.getUsersByBoard = function(boardId) {
  return Board.forge({id: boardId})
    .fetch()
    .then(board => {
      if (!board) {
        throw 'invalid board';
      }
      return board.related('users').fetch();
    })
    .then((users) => {
      return users.toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: board ID ${boardId} doesn't exist!`);
      throw situation;
    });
};

module.exports.getBoardsByUser = function(userId) {
  return User.forge({id: userId})
    // .fetchAll({withRelated: ['boards']})
    .fetch()
    .then(user => {
      if (!user) {
        throw 'invalid user';
      }
      return user.related('memberOfBoards').fetch();
    })
    .then((boards) => {
      return boards.toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: user ID ${userId} doesn't exist!`);
      throw situation;
    });
};

module.exports.createBoard = function(data) {
  return Board.where({board_name: data.board_name})
    .fetch()
    .then((board) => {
      if (board) {
        throw 'duplicate board';
      }
      return Board.forge(data).save();
    })
    .then(board => {
      console.log(`Board ${board.toJSON().board_name} saved!`);
      return board.toJSON();
    })
    .catch(situation => {
      console.log(`Board ${data.board_name} already exists!`);
      throw situation;
    });
};

module.exports.getBoardById = function(boardId) {
  return Board.forge({id: boardId})
    .fetch()
    .then(board => {
      if (!board) {
        throw 'invalid board';
      }
      return board.toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: board ID ${boardId} doesn't exist!`);
      throw situation;
    });
};

module.exports.updateBoardById = function(boardId, data) {
  console.log('data:', data, 'boardId: ', boardId);
  return Board.forge({id: boardId})
    .fetch()
    .then(board => {
      if (!board) {
        throw 'invalid board';
      }
      return board.save(data);
    })
    .then(board => {
      console.log(`Board ${board.toJSON().board_name} updated!`);
      return board.toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: board ID ${boardId} doesn't exist!`);
      throw situation;
    });
};

module.exports.createPanel = function(data) {
  return Board.forge({id: data.board_id})
    .fetch({withRelated: ['panels']})
    .then(board => {
      if (!board) {
        throw 'invalid board';
      }
      let panelNames = board.related('panels').toJSON().map(panel => panel.name);
      if (panelNames.includes(data.name)) {
        throw 'duplicate panel';
      }
      return Panel.forge(data).save();
    })
    .then(panel => {
      console.log(`Panel ${panel.toJSON().name} saved!`);
      return panel.toJSON();
    })
    .catch(situation => {
      if (situation === 'invalid board') {
        console.log(`There is a situation: board ID ${data.board_id} doesn't exist!`);
      }
      if (situation === 'duplicate panel') {
        console.log(`There is a situation: panel ${data.name} already exists on this board!`);
      }
      throw situation;
    });
};

module.exports.getPanelById = function(panelId) {
  return Panel.forge({id: panelId})
    .fetch()
    .then(panel => {
      if (!panel) {
        throw 'invalid panel'; 
      }
      return panel.toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: panel ID ${panelId} doesn't exist!`);
      throw situation;
    });
};

module.exports.getPanelsByBoard = function(boardId) {
  return Board.forge({id: boardId})
    .fetch({withRelated: [{ panels: function(query) { query.orderBy('due_date'); }}]})
    .then(board => {
      if (!board) {
        throw 'invalid board';
      }
      return board.related('panels').toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: board ID ${boardId} doesn't exist!`);
      throw situation;
    });
};

module.exports.updatePanelById = function(panelId, data) {
  return Panel.forge({id: panelId})
    .fetch()
    .then(panel => {
      if (!panel) {
        throw 'invalid panel';
      }
      return panel.save(data);
    })
    .then(panel => {
      console.log(`Panel ${panel.toJSON().name} updated!`);
      return panel.toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: panel ID ${data.panel_id} doesn't exist!`);
      throw situation;
    });
};

module.exports.createTicket = function(data) {
  return Panel.forge({id: data.panel_id})
    .fetch({withRelated: 'tickets'})
    .then(panel => {
      if (!panel) {
        throw 'invalid panel';
      }
      let ticketTitles = panel.related('tickets').toJSON().map(ticket => ticket.title);
      if (ticketTitles.includes(data.title)) {
        throw 'duplicate ticket';
      }
      return Ticket.forge(data).save();
    })
    // fetch required to include created_at field in return value
    .then(ticket => {
      return Ticket.forge({id: ticket.id}).fetch();
    })
    .then(ticket => {
      return ticket.toJSON();
    })
    .catch(situation => {
      if (situation === 'invalid panel') {
        console.log(`There is a situation: panel ID ${data.panel_id} doesn't exist!`);
      }
      if (situation === 'duplicate ticket') {
        console.log(`There is a situation: ticket ${data.title} already exists on this panel!`);
      }
      throw situation;
    });
};

module.exports.getTicketById = function(ticketId) {
  return Ticket.forge({id: ticketId})
    .fetch()
    .then(ticket => {
      if (!ticket) {
        throw 'invalid ticket';
      }
      return ticket.toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: ticket ID ${ticketId} doesn't exist!`);
      throw situation;
    });
};

module.exports.getTicketsByUser = function(userId) {
  return User.forge({id: userId})
    .fetch({withRelated: [{ assignedTickets: function(query) { query.orderBy('status', 'DESC').orderBy('priority', 'DESC'); }}]})
    .then((user) => {
      if (!user) {
        throw 'invalid user';
      }
      return user.related('assignedTickets').toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: user ID ${userId} doesn't exist!`);
      throw situation;
    });
};

module.exports.getTicketsByPanel = function(panelId) {
  return Panel.forge({id: panelId})
    .fetch({withRelated: [{ tickets: function(query) { query.orderBy('status', 'DESC').orderBy('priority', 'DESC'); }}]})
    .then((panel) => {
      if (!panel) {
        throw 'invalid panel';
      }
      return panel.related('tickets').toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: panel ID ${panelId} doesn't exist!`);
      throw situation;
    });
};

module.exports.updateTicketById = function(ticketId, data) {
  return Ticket.forge({id: ticketId})
    .fetch()
    .then(ticket => {
      if (!ticket) {
        throw 'invalid ticket';
      }
      return ticket.save(data);
    })
    .then(ticket => {
      console.log(`Ticket ${ticket.toJSON().title} updated!`);
      return ticket.toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: ticket ID ${ticketId} doesn't exist!`);
      throw situation;
    });
};