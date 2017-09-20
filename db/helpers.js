const db = require('./');
const Promise = require('bluebird');
const User = require('./models/users.js');
const Board = require('./models/boards.js');
const Panel = require('./models/panels.js');
const Ticket = require('./models/tickets.js');
const Invite = require('./models/invites.js');
const knex = require('knex')(require('../knexfile'));

// Functions are in the following order:

// createUser
// delUserById
// getUserById
// getUserByApiKey
// getUserByIdUnhidden
// getUserByEmailNoError
// verifiedEmail
// handleExists
// emailExists
// updateUserById

// addUserToBoard
// inviteByBoard
// inviteEmailByBoard
// getRecentlyAdded
// getInvitesByUser
// uninviteByBoard
// deleteInvites
// getUsersByBoard
// getInviteesByBoard
// getBoardsByUser

// createBoard
// getBoardById
// getBoardByRepoUrl
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
      if (!('api_key' in data)) {
        throw 'no api key given';
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

module.exports.delUserById = function(userId) {
  return User.forge({id: userId})
    .destroy()
    .then(result => {
      if (!result) {
        throw 'delete error';
      }
      console.log(result.toJSON());
      return 'success';
    })
    .catch(situation => {
      console.log(`There is a situation: could not delete user ID ${userId}!`);
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
      return user.toJSON({hidden: []});
    })
    .catch(situation => {
      console.log(`There is a situation: user API key does not exist!`);
      throw situation;
    });
};

module.exports.getUserByIdUnhidden = function(userId) {
  return User.forge({id: userId})
    .fetch()
    .then(user => {
      if (!user) {
        throw 'invalid user';
      }
      return user.toJSON({hidden: []});
    })
    .catch(situation => {
      console.log(`There is a situation: user ID ${userId} does not exist!`);
      throw situation;
    });
};

//get user by email; if user doesnt exist, return a message instead of throwing error
module.exports.getUserByEmailNoError = function(email) {
  return User.forge({email: email})
    .fetch()
    .then(user => {
      if (!user) {
        return 'nonexisting user';
      }
      return user.toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: user ID ${email} does not exist!`);
      throw situation;
    });
};

module.exports.verifiedEmail = function(email) {
  return User.forge({email: email})
    .fetch()
    .then(user => {
      if (!user) {
        return false;
      }
      if (user.toJSON().verified === 1) {
        return true;
      }
      return false;
    })
    .catch(situation => {
      console.log(`There is a situation: githandle ${gitHandle}`);
      throw situation;
    });
};

module.exports.handleExists = function(gitHandle) {
  return User.forge({github_handle: gitHandle})
    .fetch()
    .then(user => {
      if (!user) {
        return false;
      }
      return true;
    })
    .catch(situation => {
      console.log(`There is a situation: githandle ${gitHandle}`);
      throw situation;
    });
};

module.exports.emailExists = function(email) {
  return User.forge({email: email})
    .fetch()
    .then(user => {
      if (!user) {
        return false;
      }
      return true;
    })
    .catch(situation => {
      console.log(`There is a situation: email ${email}`);
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

module.exports.inviteByBoard = function(githandle, boardId) {
  var boardAdd;
  return Board.forge({id: boardId})
    .fetch()
    .then(board => {
      if (!board) {
        throw 'invalid board';
      }
      boardAdd = board;
      return User.forge({github_handle: githandle}).fetch({withRelated: ['invitedToBoards']});
    })
    .then(user => {
      if (!user) {
        throw 'invalid user';
      }
      let boardIds = user.related('invitedToBoards').toJSON().map(board => board.id);
      if (boardIds.includes(boardId)) {
        return 'duplicate invite';
      }
      return user.invitedToBoards().attach(boardId);
    })
    .then(result => {
      if (typeof result === 'string') {
        return result;
      }
      console.log(result.toJSON());
      return result.toJSON();
    })
    .catch(situation => {
      if (situation === 'invalid board') {
        console.log(`There is a situation: board ID ${boardId} doesn't exist!`);
      }
      if (situation === 'invalid user') {
        console.log(`There is a situation: githandle ${githandle} doesn't exist!`);
      }
      console.log(situation);
      throw situation;
    });
};

module.exports.inviteEmailByBoard = function(email, boardId) {
  var boardAdd;
  return Board.forge({id: boardId})
    .fetch()
    .then(board => {
      if (!board) {
        throw 'invalid board';
      }
      boardAdd = board;
      return User.forge({email: email}).fetch({withRelated: ['invitedToBoards']});
    })
    .then(user => {
      if (!user) {
        throw 'invalid user';
      }
      let boardIds = user.related('invitedToBoards').toJSON().map(board => board.id);
      if (boardIds.includes(boardId)) {
        return 'duplicate invite';
      }
      return user.invitedToBoards().attach(boardId);
    })
    .then(result => {
      if (typeof result === 'string') {
        return result;
      }
      return result.toJSON();
    })
    .catch(situation => {
      if (situation === 'invalid board') {
        console.log(`There is a situation: board ID ${boardId} doesn't exist!`);
      }
      if (situation === 'invalid user') {
        console.log(`There is a situation: email ${email} doesn't exist!`);
      }
      console.log(situation);
      throw situation;
    });
};

//for email worker to
//get invite list of non-verified users and their invited boards, where last_email > 2 days ago
module.exports.getInvitees = function(unhide=false) {
  return User.where({verified: 0}).fetchAll()
    .then(users => {
      if (!users) {
        throw 'error';
      }
      var promiseArray = users.map(eachUser => eachUser.fetch({withRelated: [
        {invitedToBoards: function(query) {
          //query.whereRaw('last_email = "null"');
          query.where('last_email', null).orWhereRaw(`last_email < now()-INTERVAL '2 days'`);
        }}
      ]}));
      return Promise.all(promiseArray);
    })
    .then(users => {
      if (!users) {
        throw 'error';
      }
      //unhide or hide the api key
      var hideObj = unhide ? {hidden: []} : {};
      users = users.map(eachUser => eachUser.toJSON(hideObj));
      //users = users.filter(eachUser => eachUser.toJSON().length > 0);
      //console.log('all invitees in the db', users.map(eachUser => eachUser.toJSON().invitedToBoards));
      users = users.filter(eachUser => eachUser.invitedToBoards.length > 0);
      console.log('all invitees in the db', users);
      return users;
    })
    .catch(err => {
      console.log('Error while getting all invites in the db');
      throw err;
    });
};

//after email worker emails invitees, it will call this function to
//mark invites in the invite join table between invitee and board as recently emailed
module.exports.emailedInvites = function(inviteIDs) {
  return Promise.resolve(inviteIDs)
    .then(arrayIn => {
      if (inviteIDs.length === 0) {
        throw 'empty array';
      }
      return true;
    })
    .then(() => {
      return Invite.where('id', 'in', inviteIDs).fetch();
    })
    .then(invites => {
      if (!invites) {
        throw 'empty array';
      }
      return Invite.where('id', 'in', inviteIDs)
        .save({'last_email': knex.fn.now()}, { method: 'update' });
    })
    .then(result => {
      if (!result) {
        throw 'save error';
      }
      console.log(result.toJSON());
      return 'success';
    })
    .error(err => {
      console.log('there was an error updating invite email dates');
      throw err;
    })
    .catch(situation => {
      if (situation === 'empty array') {
        console.log('there is no email dates to update in invite table');
        return 'empty';
      }
      if (situation === 'save error') {
        console.log('Saving recent emailed invites failed');
      }
      throw situation;
    });
};

//for email worker to
//get recent added list of verified users and the boards they were added to, where last_email is null
//they will later be emailed once and then deleted from invite board by web worker
module.exports.getRecentlyAdded = function() {
  return User.where({verified: 1}).fetchAll()
    .then(users => {
      if (!users) {
        throw 'error';
      }
      var promiseArray = users.map(eachUser => eachUser.fetch({withRelated: [
        {invitedToBoards: function(query) {
          query.where('last_email', null);
        }}
      ]}));
      return Promise.all(promiseArray);
    })
    .then(users => {
      if (!users) {
        throw 'error';
      }
      users = users.map(eachUser => eachUser.toJSON());
      users = users.filter(eachUser => eachUser.invitedToBoards.length > 0);
      console.log('all invitees in the db', users);
      return users;
    })
    .catch(err => {
      console.log('Error while getting all invites in the db');
      throw err;
    });
};

module.exports.getInvitesByUser = function(userId) {
  return User.forge({id: userId})
    .fetch()
    .then(user => {
      if (!user) {
        throw 'invalid user';
      }
      return user.related('invitedToBoards').fetch();
    })
    .then((boards) => {
      console.log(`User ${userId} is invited to`);
      console.log(boards.toJSON());
      return boards.toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: user ID ${userId} doesn't exist!`);
      throw situation;
    });
};

module.exports.uninviteByBoard = function(githandle, boardId) {
  return User.forge({github_handle: githandle}).fetch({withRelated: ['invitedToBoards']})
    .then(user => {
      if (!user) {
        throw 'invalid user';
      }
      console.log(user.related('invitedToBoards').toJSON());
      var boardIds = user.related('invitedToBoards').toJSON().map(board => board.id);

      if (!boardIds.includes(boardId)) {
        return 'user already not in invitee list';
      }
      return user.invitedToBoards().detach(boardId);
    })
    .then(result => {
      if (result === 'user already not in invitee list') {
        return result;
      }
      if (!result || result.toJSON().length !== 0) {
        throw 'uninvite error';
      }
      console.log(result.toJSON());
      return result.toJSON();
    })
    .catch(situation => {
      if (situation === 'invalid user') {
        console.log(`There is a situation: githandle ${githandle} doesn't exist!`);
      }
      if (situation === 'uninvite error') {
        console.log(`There is a situation: Couldnt delete ${githandle} from invite table to board ${boardId}`);
      }
      throw situation;
    });
};

//after email worker emails recently added members, it will call this function to
//remove them from join table
module.exports.deleteInvites = function(inviteIDs) {
  return Promise.resolve(inviteIDs)
    .then(arrayIn => {
      if (inviteIDs.length === 0) {
        throw 'empty array';
      }
      return true;
    })
    .then(() => {
      return Invite.where('id', 'in', inviteIDs).fetch();
    })
    .then(invites => {
      if (!invites) {
        throw 'empty array';
      }
      return Invite.where('id', 'in', inviteIDs)
        .destroy();
    })
    .then(result => {
      if (!result) {
        throw 'save error';
      }
      console.log(result.toJSON());
      return 'success';
    })
    .error(err => {
      console.log('there was an error deleting invites');
      throw err;
    })
    .catch(situation => {
      if (situation === 'empty array') {
        console.log('there is nothing to delete from invites table');
        return 'empty';
      }
      if (situation === 'save error') {
        console.log('Deleting invites failed');
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

module.exports.getInviteesByBoard = function(boardId) {
  return Board.forge({id: boardId})
    .fetch()
    .then(board => {
      if (!board) {
        throw 'invalid board';
      }
      return board.related('invitedHandles').query('where', 'verified', 0).fetch();
    })
    .then((handles) => {
      console.log('Invited to board', handles.toJSON());
      return handles.toJSON();
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

module.exports.getBoardByRepoUrl = function(boardRepoUrl) {
  return Board.forge({repo_url: boardRepoUrl})
    .fetch()
    .then(board => {
      if (!board) {
        throw 'invalid board';
      }
      return board.toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: board repo-url ${boardRepoUrl} doesn't exist!`);
      throw situation;
    });
};

module.exports.updateBoardById = function(boardId, data) {

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

module.exports.getTicketsByUserHandleAndBoard = function(userHandle, boardId) {
  return User.forge({github_handle: userHandle})
  .fetch({withRelated: [{ assignedTickets: function(query) {query.where({board_id: boardId}).orderBy('id', 'ASC'); }}]})
    .then((user) => {
      if (!user) {
        throw 'invalid user';
      }
      return user.related('assignedTickets').toJSON();
    })
    .catch(situation => {
      console.log(`There is a situation: user handle ${userHandle} doesn't exist!`);
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