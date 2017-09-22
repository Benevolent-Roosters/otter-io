const models = require('../../db/models');
const dbhelper = require('../../db/helpers.js');
const helper = require('./helper');

module.exports.getPanelTickets = (req, res) => {
  if (helper.checkUndefined(req.query.panel_id)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  //req.query.panel_id used to be req.params.panel_id but axios GET can only put in req.query
  var panelId = req.query.panel_id;
  dbhelper.getTicketsByPanel(panelId)
    .then(tickets => {
      if (!tickets) {
        throw 'cant get tickets by panel id';
      }
      res.status(200).send(tickets);
    })
    .catch(err => {
      // This code indicates an outside service (the database) did not respond in time
      res.status(500).send(JSON.stringify(err));
    });
};

/** TODO: WRITE TEST FOR THIS FUNCTION **/
module.exports.getPanelTicketsByUser = (req, res) => {
  if (helper.checkUndefined(req.query.panel_id)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  
  var panelId = req.query.panel_id;
  dbhelper.getTicketsByPanel(parseInt(panelId))
    .then(tickets => {
      if (!tickets) {
        throw 'cant get tickets by panel id';
      }
      
      //filter for user tickets
      let userTickets = tickets.filter(ticket => {
        return ticket.assignee_handle === req.query.github_handle;
      });

      res.status(200).send(userTickets.reverse());
    })
    .catch(err => {
      // This code indicates an outside service (the database) did not respond in time
      res.status(500).send(JSON.stringify(err));
    });
};

module.exports.createPanelTicket = (req, res) => {

  if (helper.checkUndefined(
    req.body.title,
    req.body.description,
    req.body.status,
    req.body.priority,
    req.body.type,
    req.body.creator_id,
    req.body.assignee_handle,
    req.body.board_id,
    req.body.panel_id
  )) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }

  // Match ticket creator to user for web client only
  if (req.user) {
    if (parseInt(req.body.creator_id) !== req.user.id) {
      res.status(400).send('creator_id field from client doesnt match actual logged in user');
      return;
    }
    req.body.creator_id = req.user.id;
  }

  var ticketObj = {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    type: req.body.type,
    creator_id: req.body.creator_id,
    assignee_handle: req.body.assignee_handle,
    board_id: req.body.board_id,
    panel_id: req.body.panel_id
  };
  //check that assignee_handle is actually a member of the board_id
  //get members of board
  console.log('typeof boardid', typeof ticketObj.board_id);
  dbhelper.getUsersByBoard(parseInt(ticketObj.board_id))
    .then((users) => {
      if (!users) {
        throw 'couldnt get users for board';
      }
      var boardMember = false;
      users.forEach(eachUser => {
        if (eachUser.github_handle === ticketObj.assignee_handle) {
          boardMember = true;
        }
      });
      if (!boardMember) {
        throw 'assignee_handle is not member of board';
      }
      return dbhelper.createTicket(ticketObj);
    })
    .then(ticket => {
      if (!ticket) {
        throw 'cant create ticket';
      }
      res.status(201).send(ticket);
    })
    .catch(err => {
      res.status(500).send(JSON.stringify(err));
    });
};

module.exports.getOneTicket = (req, res) => {
  if (helper.checkUndefined(req.params.id) && helper.checkUndefined(req.query.id)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  var ticketId = req.params.id || req.query.id;
  dbhelper.getTicketById(parseInt(ticketId))
    .then(ticket => {
      if (!ticket) {
        throw 'cant get ticket by id';
      }
      // Req from CLI contains board_id; if CLI repo board ID doesn't match ticket board ID, send 401      
      if (req.query.board_id && parseInt(req.query.board_id) !== ticket.board_id) {
        res.status(401).send('invalid ticket id');
        return;
      }
      res.status(200).send(ticket);
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
};

/** WRITE TEST FOR THIS ROUTE **/
module.exports.getUserTicketsByBoard = (req, res) => {
  if (helper.checkUndefined(req.query.user_id, req.query.github_handle, req.query.board_id, req.query.api_key)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  
  var userHandle = req.query.github_handle;
  var boardId = req.query.board_id;
  dbhelper.getTicketsByUserHandleAndBoard(userHandle, parseInt(boardId))
    .then(tickets => {
      if (!tickets) {
        throw 'cant get tickets by panel id';
      }
      res.status(200).send(tickets);
    })
    .catch(err => {
      // This code indicates an outside service (the database) did not respond in time
      res.status(500).send(JSON.stringify(err));
    });
};

module.exports.updateTicket = (req, res) => {
  if (helper.checkUndefined(req.body)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }

  var ticketObj = req.body;
  var ticketId = ticketObj.id;

  // These included in request from CLI; removing from ticket being stored in DB
  delete ticketObj.api_key;
  delete ticketObj.user_id;

  var validKeys = {
    'id': true,
    'title': true,
    'description': true,
    'status': true,
    'priority': true,
    'type': true,
    'creator_id': true,
    'assignee_handle': true,
    'board_id': true,
    'panel_id': true
  };
  for (var key in ticketObj) {
    if (ticketObj.hasOwnProperty(key)) {
      if (!(key in validKeys)) {
        res.status(400).send(`${key} not a valid field`);
        return;
      }
    }
  }
  if (!ticketId) {
    res.status(400).send(`Update ticket object ${JSON.stringify(ticketId)} doesnt have id field`);
    return;
  }
  dbhelper.getTicketById(parseInt(ticketId))
    .then(ticket => {
      if (!ticket) {
        throw 'cant get ticket by id';
      }
      return dbhelper.getUsersByBoard(parseInt(ticket.board_id));
    })
    .then((users) => {
      if (!users) {
        throw 'couldnt get users for board';
      }
      var boardMember = false;
      if (!('assignee_handle' in ticketObj)) {
        boardMember = true;
      } else {
        users.forEach(eachUser => {
          if (eachUser.github_handle === ticketObj.assignee_handle) {
            boardMember = true;
          }
        });
      }
      if (!boardMember) {
        throw 'assignee_handle is not member of board';
      }
      return dbhelper.updateTicketById(parseInt(ticketId), ticketObj);
    })
    .then((ticket) => {
      if (!ticket) {
        throw 'cant update ticket by id';
      }
      res.status(201).send(ticket);
    })
    .catch(err => {
      res.status(500).send(JSON.stringify(err));
    });
};

module.exports.deleteOne = (req, res) => {
  if (helper.checkUndefined(req.params.id)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  models.Ticket.where({ id: req.params.id }).fetch()
    .then(ticket => {
      if (!ticket) {
        throw ticket;
      }
      return ticket.destroy();
    })
    .then(() => {
      res.sendStatus(200);
    })
    .error(err => {
      res.status(503).send(err);
    })
    .catch(() => {
      res.sendStatus(404);
    });
};