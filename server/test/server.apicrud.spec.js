'use strict';
const request = require('supertest');
var authenticated, agent;
const express = require('express');
const expect = require('chai').expect;
const app = require('../app.js');
const dbUtils = require('../../db/lib/utils.js');
const knex = require('knex')(require('../../knexfile'));
//const axios = require('axios');

describe('CRUD API authorization', function () {
  beforeEach(function (done) {
    authenticated = request(app);
    agent = request.agent(app);
    knex('knex_migrations_lock').where('is_locked', '1').del()
      .then(() => {
        dbUtils.rollbackMigrate(done);
      });
  });

  // Resets database back to original settings
  afterEach(function (done) {
    knex('knex_migrations_lock').where('is_locked', '1').del()
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

  it('rejects unauthorized POST requests to /api/boards when user is not logged in', function(done) {
    agent.post('/api/boards')
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

  //send board_id in query parameter?????????????????????????????????????????
  it('rejects unauthorized GET requests to /api/panels for boards that user isnt member of', function(done) {
    //axios.get('http://localhost:3000/api/panels', {params: {board_id: 3}})//shows up as req.query.board_id
    //axios.get('http://localhost:3000/api/panels', {data: {board_id: 3}})//shows up as req.body.board_id
    //axios.get('http://localhost:3000/api/panels', {board_id: 3})//shows up as nothing?????????
    //http://localhost:3000/api/panels?board_id=3 shows up as req.query.board_id
    // axios({
    //   method: 'get',
    //   url: 'http://localhost:3000/api/panels',
    //   params: {},
    //   data: {board_id: 3}
    // })
    agent.get('/auth/fake')
      .then((res) => {
        return agent.get('/api/panels')
          .send({board_id: 3}); //shows up as req body { board_id: 3 }
        //.query({board_id: 3}); //shows up as req.query.board_id
      })
      .then((res) => {
        console.log(res.body);
        expect(res.status).to.equal(401);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('rejects unauthorized POST requests to /api/panels for boards that user doesnt own', function(done) {
    //axios.post('http://localhost:3000/api/panels', {name: 'hey', due_date: '2017-09-09', board_id: 3})
    agent.get('/auth/fake')
      .then((res) => {
        return agent.post('/api/panels')
          .send({
            name: 'hey',
            due_date: '2017-09-09',
            board_id: 3
          });
      })
      .then((res) => {
        expect(res.status).to.equal(401);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('rejects unauthorized PUT requests to /api/panels for boards that user doesnt own', function(done) {
    //axios.put('http://localhost:3000/api/panels', {id: 3, name: 'hello', due_date: '2000-09-09', board_id: 3})
    agent.get('/auth/fake')
      .then((res) => {
        return agent.put('/api/panels')
          .send({
            id: 3,
            name: 'hello',
            due_date: '2000-09-09',
            board_id: 3
          });
      })
      .then((res) => {
        expect(res.status).to.equal(401);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('rejects unauthorized GET requests to /api/panels/:id for boards that user isnt member of', function(done) {
    agent.get('/auth/fake')
      .then((res) => {
        return agent.get('/api/panels/3');
      })
      .then((res) => {
        expect(res.status).to.equal(401);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });
});

describe('CRUD API boards', function () {
  beforeEach(function (done) {
    authenticated = request(app);
    agent = request.agent(app);
    knex('knex_migrations_lock').where('is_locked', '1').del()
      .then(() => {
        dbUtils.rollbackMigrate(done);
      });
  });

  // Resets database back to original settings
  afterEach(function (done) {
    knex('knex_migrations_lock').where('is_locked', '1').del()
      .then(() => {
        dbUtils.rollback(done);
      });
  });

  it('accepts GET requests to /api/boards to get all of current user s boards', function(done) {
    agent.get('/auth/fake3')
      .then((res) => {
        return agent.get('/api/boards');
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(1);
        expect(res.body[0].board_name).to.equal('testboard3');
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  //uncomment when length bug is fixed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  it('accepts GET requests to /api/boards even if user has no boards', function(done) {
    agent.get('/auth/fake2')
      .then((res) => {
        return agent.get('/api/boards');
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(0);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('accepts POST requests to /api/boards to create a board', function(done) {
    agent.get('/auth/fake3')
      .then((res) => {
        return agent.post('/api/boards')
          .send({
            board_name: 'newboard',
            repo_name: 'new board',
            repo_url: 'https://github.com/Benevolent-Roosters/newboard',
            owner_id: 3
          });
      })
      .then((res) => {
        expect(res.status).to.equal(201);
        expect(res.body.board_name).to.equal('newboard');
        return agent.get('/api/boards');
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(2);
        expect(res.body[1].board_name).to.equal('newboard');
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('accepts POST requests to /api/boards for new user to create a board', function(done) {
    agent.get('/auth/fake2')
      .then((res) => {
        return agent.post('/api/boards')
          .send({
            board_name: 'newboard',
            repo_name: 'new board',
            repo_url: 'https://github.com/Benevolent-Roosters/newboard',
            owner_id: 2
          });
      })
      .then((res) => {
        expect(res.status).to.equal(201);
        expect(res.body.board_name).to.equal('newboard');
        return agent.get('/api/boards');
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(1);
        expect(res.body[0].board_name).to.equal('newboard');
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('rejects POST requests to /api/boards to create duplicate board', function(done) {
    agent.get('/auth/fake3')
      .then((res) => {
        return agent.post('/api/boards')
          .send({
            board_name: 'testboard3',
            repo_name: 'new board',
            repo_url: 'https://github.com/Benevolent-Roosters/newboard',
            owner_id: 3
          });
      })
      .then((res) => {
        expect(res.status).to.equal(500);
        return agent.get('/api/boards');
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(1);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('accepts PUT requests to /api/boards to update a board', function(done) {
    agent.get('/auth/fake3')
      .then((res) => {
        return agent.put('/api/boards')
          .send({
            id: 3,
            board_name: 'rename',
            repo_name: 'rename',
            repo_url: 'https://github.com/Benevolent-Roosters/rename',
            owner_id: 3
          });
      })
      .then((res) => {
        expect(res.status).to.equal(201);
        expect(res.body.board_name).to.equal('rename');
        return agent.get('/api/boards');
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(1);
        expect(res.body[0].board_name).to.equal('rename');
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  //similar to 'rejects unauthorized PUT requests to /api/boards that user isnt an owner of'
  it('rejects PUT requests to /api/boards to update boardID that doesnt exist', function(done) {
    agent.get('/auth/fake3')
      .then((res) => {
        return agent.put('/api/boards')
          .send({
            id: 200,
            board_name: 'rename',
            repo_name: 'rename',
            repo_url: 'https://github.com/Benevolent-Roosters/rename',
            owner_id: 3
          });
      })
      .then((res) => {
        expect(res.status).to.equal(404);
        return agent.get('/api/boards');
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(1);
        expect(res.body[0].board_name).to.equal('testboard3');
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('accepts GET requests to /api/boards/:id to get particular boardId', function(done) {
    agent.get('/auth/fake3')
      .then((res) => {
        return agent.get('/api/boards/3');
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.board_name).to.equal('testboard3');
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('rejects GET requests to /api/boards/:id for boardId that doesnt exist', function(done) {
    agent.get('/auth/fake3')
      .then((res) => {
        return agent.get('/api/boards/200');
      })
      .then((res) => {
        expect(res.status).to.equal(401);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('accepts GET and POST requests to /api/boards/:id/members for board owner to view and add members to board', function(done) {
    agent.get('/auth/fake')
      .then((res) => {
        return agent.get('/api/boards/1/members');
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(1);
        expect(res.body[0].id).to.equal(1);
        return agent.post('/api/boards/1/members')
          .send({user_id: 2});
      })
      .then((res) => {
        expect(res.status).to.equal(201);
        return agent.get('/api/boards/1/members');
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(2);
        expect(res.body[1].id).to.equal(2);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });
});

describe('CRUD API panels', function () {
  beforeEach(function (done) {
    authenticated = request(app);
    agent = request.agent(app);
    knex('knex_migrations_lock').where('is_locked', '1').del()
      .then(() => {
        dbUtils.rollbackMigrate(done);
      });
  });

  // Resets database back to original settings
  afterEach(function (done) {
    knex('knex_migrations_lock').where('is_locked', '1').del()
      .then(() => {
        dbUtils.rollback(done);
      });
  });

  it('accepts GET requests to /api/panels showing 3 panels of a particular board', function(done) {
    agent.get('/auth/fake3')
      .then((res) => {
        return agent.get('/api/panels')
          .send({board_id: 3});
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);
        expect(res.body[2].name).to.equal('testpanel3C');
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  //uncomment when length bug is fixed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  it('accepts GET requests to /api/panels showing 0 panels of a particular board', function(done) {
    agent.get('/auth/fake2')
      .then((res) => {
        return agent.post('/api/boards/2/members')
          .send({user_id: 2});
      })
      .then((res) => {
        expect(res.status).to.equal(201);
        return agent.get('/api/panels')
          .send({board_id: 2});
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(0);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  //this is to check that if client is missing required data in req.body, the server will catch it early on
  it('rejects POST requests to /api/panels to create panel if client doesnt provide enough data', function(done) {
    agent.get('/auth/fake3')
      .then((res) => {
        return agent.post('/api/panels')
          .send({});
      })
      .then((res) => {
        expect(res.status).to.equal(400);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('accepts POST requests to /api/panels to create panel in a board that user owns', function(done) {
    agent.get('/auth/fake3')
      .then((res) => {
        return agent.post('/api/panels')
          .send({name: 'new panel', due_date: '2015-09-09', board_id: '3'});
      })
      .then((res) => {
        expect(res.status).to.equal(201);
        return agent.get('/api/panels')
          .send({board_id: 3});
      })
      .then((res) => {
        expect(res.body.length).to.equal(4);
        expect(res.body[3].name).to.equal('new panel');
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('rejects POST requests to /api/panels to create duplicate panel in a board that user owns', function(done) {
    agent.get('/auth/fake3')
      .then((res) => {
        return agent.post('/api/panels')
          .send({name: 'testpanel3A', due_date: '2015-09-09', board_id: '3'});
      })
      .then((res) => {
        expect(res.status).to.equal(500);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('accepts POST requests to /api/panels to create 1st panel in a board that user owns', function(done) {
    agent.get('/auth/fake2')
      .then((res) => {
        return agent.post('/api/panels')
          .send({name: 'new panel', due_date: '2015-09-09', board_id: '2'});
      })
      .then((res) => {
        expect(res.status).to.equal(201);
        return agent.post('/api/boards/2/members')
          .send({user_id: 2});
      })
      .then((res) => {
        expect(res.status).to.equal(201);
        return agent.get('/api/panels')
          .send({board_id: 2});
      })
      .then((res) => {
        expect(res.body.length).to.equal(1);
        expect(res.body[0].name).to.equal('new panel');
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('rejects PUT requests to /api/panels to update nonexistent panel in board that user owns', function(done) {
    agent.get('/auth/fake3')
      .then((res) => {
        return agent.put('/api/panels')
          .send({id: 200, name: 'nonexistent', due_date: '2015-09-09', board_id: '3'});
      })
      .then((res) => {
        expect(res.status).to.equal(500);
        return agent.get('/api/panels')
          .send({board_id: 3});
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);
        expect(res.body[2].name).to.equal('testpanel3C');
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('accepts PUT requests to /api/panels to update existing panel in board that user owns', function(done) {
    agent.get('/auth/fake')
      .then((res) => {
        return agent.put('/api/panels')
          .send({id: 1, name: 'newname', due_date: '2015-09-09', board_id: '1'});
      })
      .then((res) => {
        expect(res.status).to.equal(201);
        return agent.get('/api/panels')
          .send({board_id: 1});
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(1);
        expect(res.body[0].name).to.equal('newname');
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('accepts GET requests to /api/panels/:id to get particular panelId', function(done) {
    agent.get('/auth/fake3')
      .then((res) => {
        return agent.get('/api/panels/3');
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('testpanel3B');
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

  it('rejects GET requests to /api/panels/:id for panelId that doesnt exist', function(done) {
    agent.get('/auth/fake3')
      .then((res) => {
        return agent.get('/api/panels/200');
      })
      .then((res) => {
        expect(res.status).to.equal(500);
        done();
      })
      .catch((err) => {
        return done(err);
      });
  });

});
