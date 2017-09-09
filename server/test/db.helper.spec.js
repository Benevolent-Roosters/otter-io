const expect = require('chai').expect;
const dbUtils = require('../../db/lib/utils.js');
const models = require('../../db/models');
const knex = require('knex')(require('../../knexfile'));

xdescribe('User', () => {
  beforeEach(function (done) {
    dbUtils.rollbackMigrate(done);
  });

  // Resets database back to original settings
  afterEach(function (done) {
    knex('knex_migrations_lock').where('is_locked', '0').del()
      .then(() => {
        dbUtils.rollback(done);
      });
  });

  describe('createUser()', () => {
    it('Should exist', () => {
      expect(models.User.createUser).to.exist;
    });
    it('Should be a function', () => {
      expect(models.User.createUser).to.be.a('function');
    });
    it('Should create a user if it doesnt exist in the database', (done) => {
      var profileInfo = {
        github_handle: 'dummyuser',
        profile_photo: 'http://www.mypic.com',
        oauth_id: '12345',
        email: 'baseball@aol.com'
      };
      return models.User.createUser(profileInfo)
        .then((user) => {
          expect(user).to.exist;
          expect(user.length).to.equal(1);
          expect(user[0].get('github_handle')).to.equal('dummyuser');
          expect(user[0].get('profile_photo')).to.equal('http://www.mypic.com');
          expect(user[0].get('oauth_id')).to.equal('12345');
          expect(user[0].get('email')).to.equal('baseball@aol.com');
          expect(user[0].get('lastboard_id')).to.be(null);
          done();
        })
        .error((err) => done(err));
    });
    it('Should reject if passed in duplicate github_handle', () => {
      var profileInfo = {
        github_handle: 'stevepkuo',
        profile_photo: 'http://www.mypic.com',
        oauth_id: '12345',
        email: 'baseball@aol.com'
      };
      return expect(models.User.createUser(profileInfo)).to.be.rejected;
    });
    it('Should reject if passed in undefined', () => {
      return expect(models.User.createUser(undefined)).to.be.rejected;
    });
    it('Should reject if passed in null', () => {
      return expect(models.User.createUser(null)).to.be.rejected;
    });
  });
  describe('updateUserById()', () => {
    it('Should exist', () => {
      expect(models.User.updateUserById).to.exist;
    });
    it('Should be a function', () => {
      expect(models.User.updateUserById).to.be.a('function');
    });
    it('Should update a user if it already exist in the database', (done) => {
      var profileInfo = {
        github_handle: 'stevepkuo',
        profile_photo: 'http://www.mypic.com',
        oauth_id: '12345',
        email: 'baseball@aol.com'
      };
      return models.User.updateUserById('stevepkuo', profileInfo)
        .then((user) => {
          expect(user).to.exist;
          expect(user.length).to.equal(1);
          expect(user[0].get('github_handle')).to.equal('stevepkuo');
          expect(user[0].get('profile_photo')).to.equal('http://www.mypic.com');
          expect(user[0].get('oauth_id')).to.equal('12345');
          expect(user[0].get('email')).to.equal('baseball@aol.com');
          expect(user[0].get('lastboard_id')).to.be(null);
          done();
        })
        .error((err) => done(err));
    });
    it('Should reject if passed in new profile', () => {
      var profileInfo = {
        github_handle: 'dummyuser',
        profile_photo: 'http://www.mypic.com',
        oauth_id: '12345',
        email: 'baseball@aol.com'
      };
      return expect(models.User.updateUserById('dummyuser', profileInfo)).to.be.rejected;
    });
    it('Should reject if passed in undefined', () => {
      return expect(models.User.updateUserById(undefined, {})).to.be.rejected;
    });
    it('Should reject if passed in null', () => {
      return expect(models.User.updateUserById(null, {})).to.be.rejected;
    });
  });
  describe('getBoardsByUser()', () => {
    it('Should exist', () => {
      expect(models.Board.getBoardsByUser).to.exist;
    });
    it('Should be a function', () => {
      expect(models.Board.getBoardsByUser).to.be.a('function');
    });
    it('Should return board linked to user', (done) => {
      return models.Board.getBoardsByUser(1)
        .then((boards) => {
          expect(boards).to.exist;
          expect(boards.length).to.equal(1);
          expect(boards[0].get('board_name')).to.equal('testboard');
          expect(boards[0].get('repo_name')).to.equal('thesis');
          expect(boards[0].get('repo_url')).to.equal('https://github.com/Benevolent-Roosters/thesis');
          expect(boards[0].get('owner_id')).to.equal(1);
          done();
        })
        .error((err) => done(err));
    });
    it('Should reject if passed in undefined', () => {
      return expect(models.Board.getBoardsByUser(undefined)).to.be.rejected;
    });
    it('Should reject if passed in null', () => {
      return expect(models.Board.getBoardsByUser(null)).to.be.rejected;
    });
  });
  describe('addUserToBoard()', () => {
    it('Should exist', () => {
      expect(models.Board.addUserToBoard).to.exist;
    });
    it('Should be a function', () => {
      expect(models.Board.addUserToBoard).to.be.a('function');
    });
    it('Should return board linked to user', (done) => {
      return models.Board.addUserToBoard(1, 2)
        .then((boards) => {
          expect(boards).to.exist;
          expect(boards.length).to.equal(2);
          expect(boards[0].get('board_name')).to.equal('testboard');
          expect(boards[1].get('board_name')).to.equal('testboard2');
          done();
        })
        .error((err) => done(err));
    });
    it('Should reject if passed in undefined', () => {
      return expect(models.Board.addUserToBoard(undefined, 2)).to.be.rejected;
    });
    it('Should reject if passed in null', () => {
      return expect(models.Board.addUserToBoard(null, 2)).to.be.rejected;
    });
  });

});