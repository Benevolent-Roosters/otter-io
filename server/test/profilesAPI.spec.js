'use strict';
const request = require('supertest');
const express = require('express');
const expect = require('chai').expect;
const app = require('../app.js');
const dbUtils = require('../../db/lib/utils.js');

describe('Profiles API', function () {
  beforeEach(function (done) {
    dbUtils.rollbackMigrate(done);
  });

  // Resets database back to original settings
  afterEach(function (done) {
    dbUtils.rollback(done);
  });

  it('accepts GET requests to /api/profiles', function (done) {
    request(app)
      .get('/api/profiles')
      .expect(res => {
        res.body = {
          length: res.body.length
        };
      })
      .expect(200, {
        length: 1
      })
      .end(done);
  });

  it('accepts GET requests to /api/profiles/:id', function (done) {
    request(app)
      .get('/api/profiles/1')
      .expect(res => {
        res.body = {
          id: res.body.id,
          github_handle: res.body.github_handle
        };
      })
      .expect(200, {
        id: 1,
        github_handle: 'stevepkuo'
      })
      .end(done);
  });

  it('sends 404 if id on GET requests to /api/profiles/:id does not exist', function (done) {
    request(app)
      .get('/api/profiles/123')
      .expect(404)
      .end(done);
  });

  // it('accepts POST requests to /api/profiles', function (done) {
  //   request(app)
  //     .post('/api/profiles')
  //     .send({
  //       username: 'TestUser4',
  //       password: 'happy'
  //     })
  //     .expect(res => {
  //       res.body = {
  //         username: res.body.username,
  //         password: res.body.password
  //       };
  //     })
  //     .expect(201, {
  //       username: 'TestUser4',
  //       password: undefined
  //     })
  //     .end(done);
  // });

  it('accepts PUT requests to /api/profiles/:id', function () {
    let profile = {
      github_handle: 'James',
      profile_photo: 'blah',
      oauth_id: '1234'
    };

    return request(app)
      .put('/api/profiles/1')
      .send(profile)
      .expect(201)
      .then(() => {
        return request(app)
          .get('/api/profiles/1')
          .expect(res => {
            res.body = {
              github_handle: res.body.github_handle,
              profile_photo: res.body.profile_photo,
              oauth_id: res.body.oauth_id
            };
          })
          .expect(200, profile);
      });
  });

  it('sends 404 if id on PUT requests to /api/profiles/:id does not exist', function (done) {
    request(app)
      .put('/api/profiles/123')
      .expect(404)
      .end(done);
  });

  // it('accepts DELETE requests to /api/profiles/:id', function (done) {
  //   request(app)
  //     .delete('/api/profiles/1')
  //     .expect(200)
  //     .end(done);
  // });

  // it('sends 404 if id on DELETE requests to /api/profiles/:id does not exist', function (done) {
  //   request(app)
  //     .delete('/api/profiles/123')
  //     .expect(404)
  //     .end(done);
  // });
});
