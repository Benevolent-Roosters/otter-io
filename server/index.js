'use strict';
require('dotenv').config();
const app = require('./app');
const db = require('../db');
const PORT = process.env.PORT || 3000;
// loading models and helpers for debugging
const models = require('../db/models');
const helpers = require('../db/helpers.js');
const knex = require('knex')(require('../knexfile'));
const emailworker = require('./workers/invitefetcher');
const {CronJob} = require('cron');

new CronJob({
  cronTime: '0 * * * * *',
  onTick: emailworker.notifyworker,
  start: true
});

new CronJob({
  cronTime: '30 * * * * *',
  onTick: emailworker.inviteworker,
  start: true
});

app.listen(PORT, () => {
  console.log('Example app listening on port ', PORT);
});
