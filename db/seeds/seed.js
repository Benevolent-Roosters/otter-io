const models = require('../models');
const knex = require('knex')(require('../../knexfile'));

exports.seed = function (knex, Promise) {
  return knex.migrate.rollback()
    .then( () => knex.migrate.latest())
    .then( () => models.User.where({github_handle: 'stevepkuo'}).fetch())
    .then((user) => {
      if (user) {  
        throw 'duplicate user stevepkuo';
      }
      return models.User.forge({
        github_handle: 'stevepkuo',
        profile_photo: 'https://avatars0.githubusercontent.com/u/14355395?v=4',
        oauth_id: '14355395'
      }).save();
    })
    .then( () => models.Board.where({board_name: 'testboard'}).fetch())
    .then((board) => {
      if (board) {
        throw 'duplicate board testboard';
      }
      return models.Board.forge({
        board_name: 'testboard',
        repo_name: 'thesis',
        repo_url: 'https://github.com/Benevolent-Roosters/thesis',
        owner_id: 1
      }).save();
    })
    .then( () => {
      return models.User.where({github_handle: 'stevepkuo'}).fetch();
    })
    .then((user) => {
      return user.memberOfBoards().attach(1);
    })
    .then( () => models.Panel.where({name: 'testpanel'}).fetch())
    .then((panel) => {
      if (panel) {
        throw 'duplicate panel testpanel';
      }
      return models.Panel.forge({
        name: 'testpanel',
        due_date: null,
        board_id: 1
      }).save();
    })
    .then( () => models.Ticket.where({title: 'testticket'}).fetch())
    .then((ticket) => {
      if (ticket) {
        throw 'duplicate ticket testticket';
      }
      return models.Ticket.forge({
        title: 'testticket',
        description: 'testing...',
        status: 'in progress',
        priority: 2,
        type: 'feature',
        created_at: knex.fn.now(),
        creator_id: 1,
        assignee_id: 1,
        board_id: 1,
        panel_id: 1
      }).save();
    })
    .then( () => {
      return models.User.where({github_handle: 'stevepkuo2'}).fetch();
    })
    .then((user) => {
      if (user) {
        throw 'duplicate user stevepkuo2';
      }
      return models.User.forge({
        github_handle: 'stevepkuo2',
        profile_photo: 'https://avatars0.githubusercontent.com/u/14355395?v=5',
        oauth_id: '14355396'
      }).save();
    })
    .then( () => {
      return models.Board.where({board_name: 'testboard2'})
        .fetch();
    })
    .then((board) => {
      if (board) {
        throw 'duplicate board testboard2';
      }
      return models.Board.forge({
        board_name: 'testboard2',
        repo_name: 'thesis2',
        repo_url: 'https://github.com/Benevolent-Roosters/thesis2',
        owner_id: 2
      }).save();
    })
    .then( () => {
      return models.User.where({github_handle: 'dsc03'}).fetch();
    })
    .then((user) => {
      if (user) {
        throw 'duplicate user dsc03';
      }
      return models.User.forge({
        github_handle: 'dsc03',
        profile_photo: 'https://avatars0.githubusercontent.com/u/25214199?v=4',
        oauth_id: '25214199'
      }).save();
    })
    .then((user) => {
      return models.Board.where({board_name: 'testboard3'})
        .fetch();
    })
    .then((board) => {
      if (board) {
        throw board;
      }
      return models.Board.forge({
        board_name: 'testboard3',
        repo_name: 'thesis3',
        repo_url: 'https://github.com/Benevolent-Roosters/thesis3',
        owner_id: 3
      }).save();
    })
    .then( () => {
      return models.User.where({github_handle: 'dsc03'}).fetch();
    })
    .then((user) => {
      return user.memberOfBoards().attach(3);
    })
    .then( () => models.Panel.where({name: 'testpanel3A'}).fetch())
    .then((panel) => {
      if (panel) {
        throw 'duplicate panel testpanel3A';
      }
      return models.Panel.forge({
        name: 'testpanel3A',
        due_date: '2017-09-19',
        board_id: 3
      }).save();
    })
    .then( () => models.Panel.where({name: 'testpanel3B'}).fetch())
    .then((panel) => {
      if (panel) {
        throw 'duplicate panel testpanel3B';
      }
      return models.Panel.forge({
        name: 'testpanel3B',
        due_date: '2017-09-20',
        board_id: 3
      }).save();
    })
    .then( () => models.Panel.where({name: 'testpanel3C'}).fetch())
    .then((panel) => {
      if (panel) {
        throw 'duplicate panel testpanel3C';
      }
      return models.Panel.forge({
        name: 'testpanel3C',
        due_date: '2017-09-21',
        board_id: 3
      }).save();
    })
    .then( () => models.Ticket.where({title: 'testticket3A'}).fetch())
    .then((ticket) => {
      if (ticket) {
        throw 'duplicate ticket testticket3A';
      }
      return models.Ticket.forge({
        title: 'testticket3A',
        description: 'testing3A...',
        status: 'in progress',
        priority: 1,
        type: 'feature',
        created_at: knex.fn.now(),
        creator_id: 3,
        assignee_id: 3,
        board_id: 3,
        panel_id: 3
      }).save();
    })
    .then( () => models.Ticket.where({title: 'testticket3B'}).fetch())
    .then((ticket) => {
      if (ticket) {
        throw 'duplicate ticket testticket3B';
      }
      return models.Ticket.forge({
        title: 'testticket3B',
        description: 'testing3B...',
        status: 'in progress',
        priority: 2,
        type: 'feature',
        created_at: knex.fn.now(),
        creator_id: 3,
        assignee_id: 3,
        board_id: 3,
        panel_id: 3
      }).save();
    })
    .then( () => models.Ticket.where({title: 'testticket3C'}).fetch())
    .then((ticket) => {
      if (ticket) {
        throw 'duplicate ticket testticket3C';
      }
      return models.Ticket.forge({
        title: 'testticket3C',
        description: 'testing3C...',
        status: 'in progress',
        priority: 3,
        type: 'feature',
        created_at: knex.fn.now(),
        creator_id: 3,
        assignee_id: 3,
        board_id: 3,
        panel_id: 3
      }).save();
    })
    .catch((situation) => {
      console.log('There is a situation: ', situation);
    });
};
