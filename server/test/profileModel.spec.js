const expect = require('chai').expect;
const Profile = require('../../db/models/profiles.js');
const dbUtils = require('../../db/lib/utils.js');

describe('Profile model tests', function () {
  // Deletes all tables, creates new tables, and seeds tables with test data
  beforeEach(function (done) {
    dbUtils.rollbackMigrate(done);
  });

  // Resets database back to original settings
  afterEach(function (done) {
    dbUtils.rollback(done);
  });

  it('Should be able to retrieve test data', function (done) {
    Profile.forge().fetchAll()
      .then(function (results) {
        expect(results.length).to.equal(1);
        expect(results.at(0).get('id')).to.equal(1);
        done();
      })
      .catch(function (err) {
        // If this expect statement is reached, there's an error.
        done(err);
      });
  });

  // it('Should verify that all usernames are unique', function (done) {
  //   // Insert a user with a username that's already in existence
  //   Profile.forge({ username: 'TestUser1', password: 'abc' }).save()
  //     .then(function (result) {
  //       done(new Error('was not supposed to succeed'))
  //     })
  //     .catch(function (err) {
  //       expect(err).to.be.an('error');
  //       expect(err).to.match(/duplicate key value violates unique constraint/);
  //       done();
  //     });
  // });

  it('Should be able to update an already existing record', function (done) {
    Profile.where({ id: 1 }).fetch()
      .then(function (result) {
        expect(result.get('id')).to.equal(1);
      })
      .then(function () {
        return Profile.where({ id: 1 }).save({ first: 'James', last: 'Davenport' }, { method: 'update' });
      })
      .then(function () {
        return Profile.where({ id: 1 }).fetch();
      })
      .then(function (result) {
        expect(result.get('first')).to.equal('James');
        expect(result.get('last')).to.equal('Davenport');
        done();
      })
      .catch(function (err) {
        // If this expect statement is reached, there's an error.
        done(err);
      });
  });

  it('Should be able to delete a record', function (done) {
    // Inserts a user
    Profile.where({ id: 1 }).destroy()
      // verifies that the user has been inserted
      .then(function () {
        return Profile.where({ id: 1 }).fetch();
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
