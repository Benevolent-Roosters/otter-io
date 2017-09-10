const expect = require('chai').expect;
const dbUtils = require('../../db/lib/utils.js');
const knex = require('knex')(require('../../knexfile'));
const dbhelper = require('../../db/helpers.js');

describe('User', () => {
  beforeEach(function (done) {
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

  describe('createUser()', () => {
    it('Should exist', () => {
      expect(dbhelper.createUser).to.exist;
    });
    it('Should be a function', () => {
      expect(dbhelper.createUser).to.be.a('function');
    });
    it('Should create a user if it doesnt exist in the database', (done) => {
      var profileInfo = {
        github_handle: 'dummyuser',
        profile_photo: 'http://www.mypic.com',
        oauth_id: '12345',
        email: 'baseball@aol.com'
      };
      dbhelper.createUser(profileInfo)
        .then((user) => {
          expect(user).to.exist;
          expect(user['github_handle']).to.equal('dummyuser');
          expect(user['profile_photo']).to.equal('http://www.mypic.com');
          expect(user['oauth_id']).to.equal('12345');
          expect(user['email']).to.equal('baseball@aol.com');
          expect(user['lastboard_id']).to.equal(undefined);
          done();
        })
        .error((err) => done(err));
    });
    it('Should reject if passed in duplicate github_handle', (done) => {
      var profileInfo = {
        github_handle: 'stevepkuo',
        profile_photo: 'http://www.mypic.com',
        oauth_id: '12345',
        email: 'baseball@aol.com'
      };
      dbhelper.createUser(profileInfo)
        .then((result) => {
          expect('not thrown').to.equal('thrown error');
          done();
        })
        .catch((err) => {
          expect('thrown error').to.equal('thrown error');
          done();
        })
        .error((err) => {
          expect('thrown error').to.equal('thrown error');
          done();
        });
    });
  });
  describe('updateUserById()', () => {
    it('Should exist', () => {
      expect(dbhelper.updateUserById).to.exist;
    });
    it('Should be a function', () => {
      expect(dbhelper.updateUserById).to.be.a('function');
    });
    it('Should update a user if it already exists in the database', (done) => {
      var profileInfo = {
        github_handle: 'stevepkuo',
        profile_photo: 'http://www.mypic.com',
        oauth_id: '12345',
        email: 'baseball@aol.com'
      };
      dbhelper.updateUserById(1, profileInfo)
        .then((user) => {
          expect(user).to.exist;
          expect(user['github_handle']).to.equal('stevepkuo');
          expect(user['profile_photo']).to.equal('http://www.mypic.com');
          expect(user['oauth_id']).to.equal('12345');
          expect(user['email']).to.equal('baseball@aol.com');
          expect(user['lastboard_id']).to.equal(null);
          done();
        })
        .catch((err) => {
          done(err);
        })
        .error((err) => done(err));
    });
    it('Should reject if passed in new profile', (done) => {
      var profileInfo = {
        github_handle: 'dummyuser',
        profile_photo: 'http://www.mypic.com',
        oauth_id: '12345',
        email: 'baseball@aol.com'
      };
      dbhelper.updateUserById(10, profileInfo)
        .then((result) => {
          expect('not thrown').to.equal('thrown error');
          done();
        })
        .catch((err) => {
          expect('thrown error').to.equal('thrown error');
          done();
        })
        .error((err) => {
          expect('thrown error').to.equal('thrown error');
          done();
        });
    });
  });
  describe('getUserById()', () => {
    it('Should exist', () => {
      expect(dbhelper.getUserById).to.exist;
    });
    it('Should be a function', () => {
      expect(dbhelper.getUserById).to.be.a('function');
    });
    it('Should return user if it exists in database', (done) => {
      dbhelper.getUserById(1)
        .then((user) => {
          expect(user).to.exist;
          expect(user['github_handle']).to.equal('stevepkuo');
          expect(user['profile_photo']).to.equal('https://avatars0.githubusercontent.com/u/14355395?v=4');
          expect(user['oauth_id']).to.equal('14355395');
          done();
        })
        .catch((err) => {
          done(err);
        })
        .error((err) => done(err));
    });
    it('Should reject if passed a user that does not exist', (done) => {
      dbhelper.getUserById(9)
        .then((result) => {
          expect('not thrown').to.equal('thrown error');
          done();
        })
        .catch((err) => {
          expect('thrown error').to.equal('thrown error');
          done();
        })
        .error((err) => {
          expect('thrown error').to.equal('thrown error');
          done();
        });
    });
  });
  describe('getBoardsByUser()', () => {
    it('Should exist', () => {
      expect(dbhelper.getBoardsByUser).to.exist;
    });
    it('Should be a function', () => {
      expect(dbhelper.getBoardsByUser).to.be.a('function');
    });
    it('Should return boards linked to user', (done) => {
      dbhelper.getBoardsByUser(1)
        .then((boards) => {
          expect(boards).to.exist;
          expect(boards.length).to.equal(1);
          expect(boards[0]['board_name']).to.equal('testboard');
          expect(boards[0]['repo_name']).to.equal('thesis');
          expect(boards[0]['repo_url']).to.equal('https://github.com/Benevolent-Roosters/thesis');
          expect(boards[0]['owner_id']).to.equal(1);
          done();
        })
        .catch((err) => {
          done(err);
        })
        .error((err) => done(err));
    });
  });
  describe('addUserToBoard()', () => {
    it('Should exist', () => {
      expect(dbhelper.addUserToBoard).to.exist;
    });
    it('Should be a function', () => {
      expect(dbhelper.addUserToBoard).to.be.a('function');
    });
    it('Should return board linked to user', (done) => {
      dbhelper.addUserToBoard(1, 2)
        .then((confirmation) => {
          return dbhelper.getBoardsByUser(1);
        })
        .then((boards) => {
          expect(boards).to.exist;
          expect(boards.length).to.equal(2);
          expect(boards[0]['board_name']).to.equal('testboard');
          expect(boards[1]['board_name']).to.equal('testboard2');
          done();
        })
        .catch((err) => {
          done(err);
        })
        .error((err) => done(err));
    });
  });
  describe('getUsersByBoard()', () => {
    it('Should exist', () => {
      expect(dbhelper.getUsersByBoard).to.exist;
    });
    it('Should be a function', () => {
      expect(dbhelper.getUsersByBoard).to.be.a('function');
    });
    it('Should return users linked to board', (done) => {
      dbhelper.getUsersByBoard(1)
        .then((users) => {
          expect(users).to.exist;
          expect(users.length).to.equal(1);
          expect(users[0]['github_handle']).to.equal('stevepkuo');
          done();
        })
        .catch((err) => {
          done(err);
        })
        .error((err) => done(err));
    });
  });

  //add user to board twice and it should fail the second time because it is redundant

});