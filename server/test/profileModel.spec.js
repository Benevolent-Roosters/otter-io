const expect = require('chai').expect;
const User = require('../../db/models/users.js');
const dbUtils = require('../../db/lib/utils.js');
const knex = require('knex')(require('../../knexfile'));

describe('User model tests', function () {
  // Deletes all tables, creates new tables, and seeds tables with test data
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
  it('Should be able to retrieve test data', function (done) {
    User.forge().fetchAll()
      .then(function (results) {
        expect(results.length).to.equal(3);
        expect(results.at(0).get('id')).to.equal(1);
        done();
      })
      .catch(function (err) {
        // If this expect statement is reached, there's an error.
        done(err);
      });
  });

  it('Should be able to update an already existing record', function (done) {
    User.where({ id: 1 }).fetch()
      .then(function (result) {
        expect(result.get('id')).to.equal(1);
      })
      .then(function () {
        return User.where({ id: 1 }).save({ github_handle: 'James'}, { method: 'update' });
      })
      .then(function () {
        return User.where({ id: 1 }).fetch();
      })
      .then(function (result) {
        expect(result.get('github_handle')).to.equal('James');
        done();
      })
      .catch(function (err) {
        // If this expect statement is reached, there's an error.
        done(err);
      });
  });

  it('Should be able to delete a record', function (done) {
    // Inserts a user
    User.where({ id: 1 }).destroy()
      // verifies that the user has been inserted
      .then(function () {
        return User.where({ id: 1 }).fetch();
      })
      .then(function (result) {
        expect(result).to.equal(null);
        done();
      })
      .catch(function (err) {
        // If this expect statement is reached, there's an error.
        done(err);
      });
  });

});
