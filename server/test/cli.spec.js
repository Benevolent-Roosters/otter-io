'use strict';
const request = require('supertest');
var authenticated, agent;
const express = require('express');
const expect = require('chai').expect;
const app = require('../app.js');
const dbUtils = require('../../db/lib/utils.js');
const knex = require('knex')(require('../../knexfile'));
//const axios = require('axios');


describe('API key authorization', function () {
  beforeEach(function (done) {
    authenticated = request(app);
    agent = request.agent(app);
    knex.schema.hasTable('knex_migrations_lock')
      .then((exists) => {
        if (exists) {
          return knex('knex_migrations_lock').where('is_locked', '1').del();
        }
        return;
      })
      .then(() => {
        dbUtils.rollbackMigrate(done);
      });
  });

  // Resets database back to original settings
  afterEach(function (done) {
    knex.schema.hasTable('knex_migrations_lock')
      .then((exists) => {
        if (exists) {
          return knex('knex_migrations_lock').where('is_locked', '1').del();
        }
        return;
      })
      .then(() => {
        dbUtils.rollback(done);
      });
  });

  it('should accept the request if the user\'s API key exist in the database', (done) => {
    agent.get('/cli/api_key')
      .query({api_key: 'cat'})

    .then(response => {
      expect(response.status).to.equal(200);
      done();
    })

    .catch(err => {
      return done(err);
    });
  });

  it('should reject the request if the user\'s API key does not exist in the database', (done) => {
    agent.get('/cli/api_key')
      .query({api_key: 'squirrel'})

    .then(response => {
      expect(response.status).to.equal(404);
      done();
    })

    .catch(err => {
      return done(err);
    });
  });
});

describe('Get Board by Repo URL', () => {
  beforeEach(function (done) {
    authenticated = request(app);
    agent = request.agent(app);
    knex.schema.hasTable('knex_migrations_lock')
      .then((exists) => {
        if (exists) {
          return knex('knex_migrations_lock').where('is_locked', '1').del();
        }
        return;
      })
      .then(() => {
        dbUtils.rollbackMigrate(done);
      });
  });

  // Resets database back to original settings
  afterEach(function (done) {
    knex.schema.hasTable('knex_migrations_lock')
      .then((exists) => {
        if (exists) {
          return knex('knex_migrations_lock').where('is_locked', '1').del();
        }
        return;
      })
      .then(() => {
        dbUtils.rollback(done);
      });
  });

  it('Should accept a repo_url and return the board_id associated with it', (done) => {
    agent.get('/cli/fake/board')
      .query({api_key: 'cat', repo_url: 'https://github.com/Benevolent-Roosters/thesis3'})
    
    .then(response => {
      expect(response.status).to.equal(200);
      expect(response.body.id).to.equal(3);
      done();
    })

    .catch(err => {
      return done(err);
    });
  });

  it('Should reject a repo_url and return an error if it does not exist in database', (done) => {
    agent.get('/cli/fake/board')
      .query({api_key: 'cat', repo_url: 'https://github.com/testingerror'})
    
    .then(response => {
      expect(response.status).to.equal(500);
      done();
    })

    .catch(err => {
      return done(err);
    });

  });
});


describe('Get Panel Tickets by User', () => {
  beforeEach(function (done) {
    authenticated = request(app);
    agent = request.agent(app);
    knex.schema.hasTable('knex_migrations_lock')
      .then((exists) => {
        if (exists) {
          return knex('knex_migrations_lock').where('is_locked', '1').del();
        }
        return;
      })
      .then(() => {
        dbUtils.rollbackMigrate(done);
      });
  });

  // Resets database back to original settings
  afterEach(function (done) {
    knex.schema.hasTable('knex_migrations_lock')
      .then((exists) => {
        if (exists) {
          return knex('knex_migrations_lock').where('is_locked', '1').del();
        }
        return;
      })
      .then(() => {
        dbUtils.rollback(done);
      });
  });

  it('Should accept a panel and user and return tickets', (done) => {
    agent.get('/cli/fake/mypaneltickets')
      .query({api_key: 'cat', user_id: 3, board_id: 3, github_handle: 'dsc03', panel_id: 3})
    
    .then(response => {
      expect(response.status).to.equal(200);
      expect(response.body[0].id).to.equal(2);
      expect(response.body[0].title).to.equal('testticket3A');
      expect(response.body[0].description).to.equal('testing3A...');
      expect(response.body[0].status).to.equal('complete');
      expect(response.body[0].priority).to.equal(2);
      expect(response.body[0].type).to.equal('feature');
      expect(response.body[0].creator_id).to.equal(3);
      expect(response.body[0].assignee_handle).to.equal('dsc03');
      expect(response.body[0].panel_id).to.equal(3);
      expect(response.body[0].board_id).to.equal(3);
      done();
    })

    .catch(err => {
      return done(err);
    });
  });

  it('Should reject a panel_id and return an error if it does not exist in database', (done) => {
    agent.get('/cli/fake/mypaneltickets')
      .query({api_key: 'cat', user_id: 3, board_id: 3, github_handle: 'dsc03', panel_id: 396})
    
    .then(response => {
      expect(response.status).to.equal(500);
      done();
    })

    .catch(err => {
      return done(err);
    });

  });
});