'use strict';
const request = require('supertest');
var authenticated, agent;
const express = require('express');
const expect = require('chai').expect;
const app = require('../app.js');
const dbUtils = require('../../db/lib/utils.js');
const knex = require('knex')(require('../../knexfile'));

describe('CRUD API', function () {
  beforeEach(function (done) {
    authenticated = request(app);
    agent = request.agent(app);
    knex('knex_migrations_lock').where('is_locked', '0').del()
      .then(() => {
        dbUtils.rollbackMigrate(done);
      });
  });

  // Resets database back to original settings
  afterEach(function (done) {
    knex('knex_migrations_lock').where('is_locked', '0').del()
      .then(() => {
        dbUtils.rollback(done);
      });
  });

  it('accepts GET requests to /auth/fake', function(done) {
    //this.timeout(3000);
    agent.get('/auth/fake')
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('rejects unauthorized GET requests to /api/boards when user is not logged in', function(done) {
    agent.get('/api/boards')
      .then((res) => {
        expect(res.status).to.equal(401);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('rejects unauthorized GET requests to /api/profiles when user is not logged in', function(done) {
    agent.get('/api/profiles')
      .then((res) => {
        expect(res.status).to.equal(401);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('rejects unauthorized PUT requests to /api/boards that user isnt an owner of', function(done) {
    agent.get('/auth/fake')
      .then((res) => {
        return agent.put('/api/boards')
          .send({id: 2});
      })
      .then((res) => {
        expect(res.status).to.equal(401);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('rejects unauthorized get requests to /api/boards/:id that user isnt a member of', function(done) {
    agent.get('/auth/fake')
      .then((res) => {
        return agent.get('/api/boards/2');
      })
      .then((res) => {
        expect(res.status).to.equal(401);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('rejects unauthorized get requests to /api/boards/:id/members that user isnt a member of', function(done) {
    agent.get('/auth/fake')
      .then((res) => {
        return agent.get('/api/boards/2/members');
      })
      .then((res) => {
        expect(res.status).to.equal(401);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('rejects unauthorized post requests to /api/boards/:id/members that user isnt an owner of', function(done) {
    agent.get('/auth/fake')
      .then((res) => {
        return agent.post('/api/boards/2/members');
      })
      .then((res) => {
        expect(res.status).to.equal(401);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('accepts GET requests to /api/boards', function(done) {
    agent.get('/auth/fake')
      .then((res) => {
        return agent.get('/api/boards');
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });


});
