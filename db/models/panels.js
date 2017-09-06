const db = require('../');
const Promise = require('bluebird');

const Panel = db.Model.extend({
  tableName: 'panels',
  panel: function() {
    return this.belongsTo('panel');
  },
  board: function() {
    return this.belongsTo('Board');
  },
  tickets: function() {
    return this.hasMany('Ticket');
  },
  getPanelById: function(panelId) {
    return Panel.forge({id: panelId})
      // {require: true} below?
      .fetch()
      .then(panel => {
        if (panel) {
          return panel.toJSON();
        } else {
          // change to throw?
          return new Promise((resolve, reject) => {
            reject(`Panel ID ${panelId} not found!`);
          });
        }
      })
      .error(err => {
        console.log(`Unable to fetch panel ID ${panelId}: `, err);
        throw err;
      });
  },
  getPanelsByBoard: function(boardId) {
    return Board.forge({id: boardId})
      // fetch?
      .fetchAll({withRelated: ['panels']})
      .then((board) => {
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
        console.log(`Unable to fetch panels for Board ID ${boardId}: `, err);
        throw err;
      })
      .catch(board => {
        console.log(`No panels found for board ${board.board_name}`);
        throw board;
      });
  },
  updatePanelById: function(panelId, data) {
    return Panel.forge({id: panelId})
      .fetch({require: true})
      .then(panel => {
        if (!panel) {
          throw data;
        } else {
          return panel.save(data);
          // NOTE: Need to include all fields?
        }
      })
      .then(panel => {
        console.log(`Panel ${data.name} updated!`);
      })
      .error(err => {
        console.log(`Unable to update panel ${panel.name}: `, err);
        throw err;
      })
      .catch(panelId => {
        console.log(`Panel ID ${panelId} not found!`);
        throw panelId;
      });
  },
  createPanel: function(data) {
    return models.Panel.where({name: data.name})
      .fetch()
      .then((panel) => {
        if (panel) {
          throw panel;
        }
        return panel.forge(data).save()
          .then(panel => {
            console.log(`Panel ${data.name} saved!`);
          })
          .error(err => {
            console.log(`Unable to create panel ${data.name}: `, err);
            throw err;
          })
          .catch(panel => {
            console.log(`Panel ${panel.name} already exists!`);
            throw panel;
          });
      });
          return panels.toJSON();
        } else {
          return new Promise((resolve, reject) => {
            reject(`Board ID ${BoardId} not found!`);
          });
        }
      })
      .error(err => {
        console.log('Unable to fetch panels: ', err);
        throw err;
      })
      .catch(panelId => {
        console.log(`Panel ID ${panelId} not found!`);
        throw panelId;
      });
  },
  createPanel: function(data) {
    return models.Panel.where({name: data.name})
      .fetch()
      .then((panel) => {
        if (panel) {
          throw panel;
        }
        return panel.forge(data).save()
          .then(panel => {
            console.log(`Panel ${data.name} saved!`);
          })
          .error(err => {
            console.log(`Unable to create panel ${data.name}: `, err);
            throw err;
          })
          .catch(panel => {
            console.log(`Panel ${panel.name} already exists!`);
            throw panel;
          });
      });
  }
}

module.exports = db.model('Panel', Panel);