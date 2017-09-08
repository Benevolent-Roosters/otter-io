const models = require('../models');
const knex = require('knex')(require('../../knexfile'));

exports.seed = function (knex, Promise) {
  return knex.migrate.rollback()
    .then( () => knex.migrate.latest())
    .then( () => models.User.where({github_handle: 'stevepkuo'}).fetch())
    .then((user) => {
      if (user) {  
        throw user;
      }
      return models.User.forge({
        github_handle: 'stevepkuo',
        profile_photo: 'https://avatars0.githubusercontent.com/u/14355395?v=4',
        oauth_id: '14355395'
      }).save();
    })
    .error(err => {
      console.log('ERROR! Could not create user seed: ', err);
    })
    .then( () => models.Board.where({board_name: 'testboard'}).fetch())
    .then(board => {
      if (board) {
        throw board;
      }
      return models.Board.forge({
        board_name: 'testboard',
        repo_name: 'thesis',
        repo_url: 'https://github.com/Benevolent-Roosters/thesis',
        owner_id: 1
      }).save();
    })
    .error(err => {
      console.log('ERROR! Could not create board seed: ', err);
    })
    .then( () => models.Panel.where({name: 'testpanel'}).fetch())
    .then(panel => {
      if (panel) {
        throw panel;
      }
      return models.Panel.forge({
        name: 'testpanel',
        due_date: null,
        board_id: 1
      }).save();
    })
    .error(err => {
      console.log('ERROR! Could not create panel seed: ', err);
    })
    .then( () => models.Ticket.where({title: 'testticket'}).fetch())
    .then((ticket) => {
      if (ticket) {
        throw ticket;
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
    .error(err => {
      console.log('ERROR! Could not create ticket seed: ', err);
    })
    .then( () => knex('boards_users').insert([{user_id: 1, board_id: 1}]))
    .catch((user = 'ok', board = 'ok', panel = 'ok', ticket = 'ok') => {
      console.log(`There is a situation... user: ${user}, board: ${board}, panel: ${panel}, ticket: ${ticket}`);
    });
};
