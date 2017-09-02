const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');
const dbUtils = require('../../db/lib/utils.js');
const passport = require('../middleware/passport');
const models = require('../../db/models');

describe('Authentication', () => {
  let fakeFlash = function(key, message) {
    let object = {};
    object[key] = message;
    return object;
  };

  beforeEach(function (done) {
    dbUtils.rollbackMigrate(done);
  });

  // Resets database back to original settings
  afterEach(function (done) {
    dbUtils.rollback(done);
  });

  describe('Passport local-login strategy', () => {
    it('passport passes user if email and password match', done => {
      let request = httpMocks.createRequest({
        body: {
          email: 'admin@domain.com',
          password: 'admin123'
        }
      });
      request.flash = fakeFlash;
      let response = httpMocks.createResponse();
      models.Profile.where({ email: 'admin@domain.com' }).fetch()
        .then(profile => {
          passport.authenticate('local-login', {}, (err, user, info) => {
            expect(user).to.be.an('object');
            expect(user.id).to.equal(profile.get('id'));
            expect(user.email).to.equal(profile.get('email'));
            done(err);
          })(request, response);
        });
    });

    it('passport passes false if email and password do not match', done => {
      let request = httpMocks.createRequest({
        body: {
          email: 'admin@domain.com',
          password: 'incorrect'
        }
      });
      request.flash = fakeFlash;
      let response = httpMocks.createResponse();
      passport.authenticate('local-login', {}, (err, user, info) => {
        expect(user).to.equal(false);
        expect(err).to.be.null;
        done(err);
      })(request, response);
    });
  });

  describe('Passport local-signup strategy', () => {
    it('passport passes false if email already exists', done => {
      let request = httpMocks.createRequest({
        body: {
          email: 'admin@domain.com',
          password: 'admin123'
        }
      });
      request.flash = fakeFlash;
      let response = httpMocks.createResponse();
      passport.authenticate('local-signup', {}, (err, user, info) => {
        expect(user).to.be.equal(false);
        expect(info.signupMessage).to.equal('An account with this email address already exists.');
        done(err);
      })(request, response);
    });

    it('passport passes user if email does not already exist', done => {
      let request = httpMocks.createRequest({
        body: {
          email: 'TestUser4@mail.com',
          password: '101112'
        }
      });
      request.flash = fakeFlash;
      let response = httpMocks.createResponse();
      passport.authenticate('local-signup', {}, (err, user, info) => {
        models.Profile.where({ email: 'TestUser4@mail.com' }).fetch()
          .then(profile => {
            expect(user).to.be.an('object');
            expect(user.id).to.equal(profile.get('id'));
            expect(user.email).to.equal(profile.get('email'));
            done(err);
          });
      })(request, response);
    });
  });
});
