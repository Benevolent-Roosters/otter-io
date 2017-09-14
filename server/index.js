'use strict';
const app = require('./app');
const db = require('../db');
const PORT = process.env.port || 3000;
// loading models and helpers for debugging
const models = require('../db/models');
const helpers = require('../db/helpers.js');
const knex = require('knex')(require('../knexfile'));

app.listen(PORT, () => {
  console.log('Example app listening on port ', PORT, ' !');
});
