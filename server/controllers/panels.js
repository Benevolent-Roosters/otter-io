const dbhelper = require('../../db/helpers.js');
const helper = require('./helper');

module.exports.getBoardPanels = (req, res) => {
  //req.query.board_id used to be req.params.board_id but axios GET can only get it into req.query
  if (helper.checkUndefined(req.query.board_id)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  var board_id = req.query.board_id;
  dbhelper.getPanelsByBoard(parseInt(board_id))
    .then(panels => {
      if (!panels) {
        throw 'cant get panels for board';
      }
      res.status(200).send(panels);
    })
    .catch(err => {
      if (err !== 'exit') {
        // This code indicates an outside service (the database) did not respond in time
        res.status(500).send(JSON.stringify(err));
      }
    });
};

module.exports.createBoardPanel = (req, res) => {
  if (helper.checkUndefined(req.body.name, req.body.due_date, req.body.board_id)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  var panelObj = {
    name: req.body.name,
    due_date: req.body.due_date,
    board_id: req.body.board_id
  };
  dbhelper.createPanel(panelObj)
    .then(panel => {
      if (!panel) {
        throw 'cant create panel';
      }
      res.status(201).send(panel);
    })
    .catch(err => {
      if (err !== 'exit') {
        res.status(500).send(JSON.stringify(err));
      }
    });
};

module.exports.getOnePanel = (req, res) => {
  if (helper.checkUndefined(req.params.id)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  var panelId = req.params.id;
  dbhelper.getPanelById(parseInt(panelId))
    .then(panel => {
      if (!panel) {
        throw 'cant get panel by id';
      }
      res.status(200).send(panel);
    })
    .catch((err) => {
      if (err !== 'exit') {
        res.status(500).send(JSON.stringify(err)); 
      }
    });
};

module.exports.updatePanel = (req, res) => {
  if (helper.checkUndefined(req.body)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  var panelObj = req.body;
  var validKeys = {
    'id': true,
    'name': true,
    'due_date': true,
    'board_id': true
  };
  for (var key in panelObj) {
    if (panelObj.hasOwnProperty(key)) {
      if (!(key in validKeys)) {
        res.status(400).send(`${key} not a valid field`);
        return;
      }
    }
  }
  var panelId = panelObj.id;
  if (!panelId) {
    res.status(400).send(`Update panel object ${JSON.stringify(panelId)} doesnt have id field`);
    return;
  }
  dbhelper.updatePanelById(parseInt(panelId), panelObj)
    .then((panel) => {
      if (!panel) {
        throw 'cant update panel by id';
      }
      res.status(201).send(panel);
    })
    .catch((err) => {
      if (err !== 'exit') {
        res.status(500).send(JSON.stringify(err));
      }
    });
};
