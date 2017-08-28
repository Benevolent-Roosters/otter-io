const knex = require('knex')(require('../knexfile'));
const db = require('bookshelf')(knex);

db.plugin('registry');

module.exports = db;

