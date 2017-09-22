'use strict';
const request = require('supertest');
var authenticated, agent;
const express = require('express');
const expect = require('chai').expect;
const app = require('../app.js');
const dbUtils = require('../../db/lib/utils.js');
const knex = require('knex')(require('../../knexfile'));
// const axios = require('axios');

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

describe('Get Board Panels', () => {
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

  it('Should accept a board and return its panels in ascending order of due_date', (done) => {
    agent.get('/cli/fake/panels')
      .query({api_key: 'cat', board_id: 3, user_id: 3})
    
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body[0].id).to.equal(2);
        expect(response.body[1].id).to.equal(3);
        expect(response.body[2].id).to.equal(4);
        done();
      })

      .catch(err => {
        return done(err);
      });
  });

  it('Should reject a board_id and return an error if it does not exist in database', (done) => {
    agent.get('/cli/fake/panels')
      .query({api_key: 'cat', user_id: 3, board_id: 5000})
    
      .then(response => {
        expect(response.status).to.equal(401);
        done();
      })

      .catch(err => {
        return done(err);
      });
  });
});

describe('Create Ticket', () => {
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

  it('Should create a new ticket with the values received from the client and store it in the database', (done) => {
    let ticketObj = {
      title: 'specTicket',
      description: 'description',
      status: 'not started',
      priority: 3,
      type: 'bug',
      creator_id: 3,
      assignee_handle: 'dsc03',
      board_id: 3,
      panel_id: 3,
      api_key: 'cat',
      user_id: 3
    };
    agent.post('/cli/fake/ticket')
      .send(ticketObj)
      .then(response => {
        expect(response.status).to.equal(201);
        return agent.get('/cli/fake/ticket')
          .query({id: 5, api_key: 'cat', board_id: 3, user_id: 3});
      })
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.id).to.equal(5);
        expect(response.body.title).to.equal('specTicket');
        expect(response.body.description).to.equal('description');
        expect(response.body.status).to.equal('not started');
        expect(response.body.priority).to.equal(3);
        expect(response.body.type).to.equal('bug');
        expect(response.body.creator_id).to.equal(3);
        expect(response.body.assignee_handle).to.equal('dsc03');
        expect(response.body.panel_id).to.equal(3);
        expect(response.body.board_id).to.equal(3);
        done();
      })

      .catch(err => {
        return done(err);
      });
  });

  it('Should reject and return an error if ticket contains an assignee that does not exist', (done) => {
    let ticketObj = {
      title: 'specTicket',
      status: 'not started',
      priority: 3,
      creator_id: 3,
      assignee_handle: 'madeupPerson',
      board_id: 3,
      panel_id: 3,
      api_key: 'cat',
      user_id: 3
    };
    agent.post('/cli/fake/ticket')
      .send(ticketObj)
      .then(response => {
        expect(response.status).to.equal(400);
        done();
      })

      .catch(err => {
        return done(err);
      });
  });

  it('Should reject and return an error if ticket contains a board that does not exist', (done) => {
    let ticketObj = {
      title: 'specTicket',
      status: 'not started',
      priority: 3,
      creator_id: 3,
      assignee_handle: 'dsc03',
      board_id: 5555,
      panel_id: 3,
      api_key: 'cat',
      user_id: 3
    };
    agent.post('/cli/fake/ticket')
      .send(ticketObj)
      .then(response => {
        expect(response.status).to.equal(400);
        done();
      })

      .catch(err => {
        return done(err);
      });
  });

  it('Should reject and return an error if ticket contains a panel that does not exist', (done) => {
    let ticketObj = {
      title: 'specTicket',
      status: 'not started',
      priority: 3,
      creator_id: 3,
      assignee_handle: 'dsc03',
      board_id: 3,
      panel_id: 5555,
      api_key: 'cat',
      user_id: 3
    };
    agent.post('/cli/fake/ticket')
      .send(ticketObj)
      .then(response => {
        expect(response.status).to.equal(404);
        done();
      })

      .catch(err => {
        return done(err);
      });
  });

  it('Should reject and return an error if ticket assignee is not a member of the current board', (done) => {
    let ticketObj = {
      title: 'specTicket',
      status: 'not started',
      priority: 3,
      creator_id: 3,
      assignee_handle: 'stevepkuo',
      board_id: 3,
      panel_id: 3,
      api_key: 'cat',
      user_id: 3
    };
    agent.post('/cli/fake/ticket')
      .send(ticketObj)
      .then(response => {
        expect(response.status).to.equal(400);
        done();
      })

      .catch(err => {
        return done(err);
      });
  });
});

describe('Update Ticket', () => {
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

  it('Should fetch a ticket using an id provided by the client', (done) => {
    agent.get('/cli/fake/ticket')
      .query({api_key: 'cat', user_id: 3, board_id: 3, id: 2})
    
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body.id).to.equal(2);
        expect(response.body.title).to.equal('testticket3A');
        expect(response.body.description).to.equal('testing3A...');
        expect(response.body.status).to.equal('complete');
        expect(response.body.priority).to.equal(2);
        expect(response.body.type).to.equal('feature');
        expect(response.body.creator_id).to.equal(3);
        expect(response.body.assignee_handle).to.equal('dsc03');
        expect(response.body.panel_id).to.equal(3);
        expect(response.body.board_id).to.equal(3);
        done();
      })

      .catch(err => {
        return done(err);
      });
  });

  it('Should update a ticket with the new values provided by the client', (done) => {
    let ticketObj = {
      id: 2,
      status: 'in progress',
      priority: 1,
      board_id: 3,
      panel_id: 3,
      api_key: 'cat',
      user_id: 3
    };
    agent.put('/cli/fake/tickets')
      .send(ticketObj)
      .then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.id).to.equal(2);
        expect(response.body.title).to.equal('testticket3A');
        expect(response.body.status).to.equal('in progress');
        expect(response.body.priority).to.equal(1);
        done();
      })

      .catch(err => {
        return done(err);
      });
  });

  it('Should reject and return an error if user inputs an assignee that does not exist', (done) => {
    let ticketObj = {
      id: 2,
      status: 'not started',
      priority: 3,
      creator_id: 3,
      assignee_handle: 'madeupPerson',
      board_id: 3,
      panel_id: 3,
      api_key: 'cat',
      user_id: 3
    };
    agent.post('/cli/fake/tickets')
      .send(ticketObj)
      .then(response => {
        expect(response.status).to.equal(404);
        done();
      })

      .catch(err => {
        return done(err);
      });
  });

  it('Should reject and return an error if ticket assignee is not a member of the current board', (done) => {
    let ticketObj = {
      id: 2,
      status: 'not started',
      priority: 3,
      creator_id: 3,
      assignee_handle: 'stevepkuo',
      board_id: 3,
      panel_id: 3,
      api_key: 'cat',
      user_id: 3
    };
    agent.post('/cli/fake/ticket')
      .send(ticketObj)
      .then(response => {
        expect(response.status).to.equal(400);
        done();
      })

      .catch(err => {
        return done(err);
      });
  });
});
