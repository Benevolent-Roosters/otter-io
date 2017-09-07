'use strict';
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;

const config = require('config')['passport'];
const models = require('../../db/models');

passport.serializeUser((profile, done) => {
  done(null, profile);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use('github', new GithubStrategy({
  clientID: config.Github.clientID,
  clientSecret: config.Github.clientSecret,
  callbackURL: config.Github.callbackURL
},
(accessToken, refreshToken, profile, done) => getOrCreateGithubOAuthProfile('github', profile, done))
);

const getOrCreateGithubOAuthProfile = (type, oauthProfile, done) => {
  return models.User.where({ oauth_id: oauthProfile.id }).fetch()
    .then(oauthAccount => {

      //check if Auth table already has user
      if (oauthAccount) {
        console.log('User table already has the Github user');
        throw oauthAccount;
      }
      console.log('Github User not found in User table');
      console.log(oauthProfile);

      let profileInfo = {
        github_handle: oauthProfile.username,
        profile_photo: oauthProfile.photos[0].value,
        oauth_id: oauthProfile.id
      };
      return models.User.forge(profileInfo).save();
    })
    .catch(oauthAccount => {
      if (!oauthAccount.get) {
        throw oauthAccount;
      }
      return oauthAccount;
    })
    .then(profile => {
      if (profile) {
        console.log('Saved user profile');
        done(null, profile.serialize());
      }
    })
    .catch((err) => {
      console.log('Not saved user profile');
      return done(err, null);
    });
};
module.exports = passport;
