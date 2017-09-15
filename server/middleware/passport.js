'use strict';
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;

const config = require('config')['passport'];
const models = require('../../db/models');
const crypto = require('crypto');

passport.serializeUser((profile, done) => {
  done(null, profile);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use('github', new GithubStrategy({
  clientID: config.Github.clientID,
  clientSecret: config.Github.clientSecret,
  callbackURL: config.Github.callbackURL,
  scope: 'user:email' //get github email
},
(accessToken, refreshToken, profile, done) => getOrCreateGithubOAuthProfile('github', profile, done))
);

const getOrCreateGithubOAuthProfile = (type, oauthProfile, done) => {
  return models.User.where({ oauth_id: oauthProfile.id }).fetch()
    .then(oauthAccount => {

      //check if Auth table already has user
      if (oauthAccount) {
        console.log('User table already has the Github user');
        console.log(oauthAccount);
      } else {
        console.log('Github User not found in User table');
        console.log(oauthProfile);
      }

      var email = null;
      oauthProfile.emails.forEach((eachEmail) => {
        if (!!eachEmail.primary) {
          email = eachEmail.value;
        }
      });
      let profileInfo = {
        github_handle: oauthProfile.username,
        profile_photo: oauthProfile.photos[0].value,
        oauth_id: oauthProfile.id,
        email: email
      };

      if (oauthAccount) {
        //update profile with info from oauthProfile
        return oauthAccount.save(profileInfo, { method: 'update' });
      }
      //otherwise create new profile /** TEMPORARY WAY FOR CREATING API_KEY CHECK API_KEY UNIQUE**/
      let buf = crypto.randomBytes(256);
      profileInfo.api_key = buf.toString('hex').slice(0, 64);
      return models.User.forge(profileInfo).save();
    })
    .then(profile => {
      if (!profile) {
        throw JSON.stringify(profile);
      }
      
      delete profile.api_key;

      console.log('Saved user profile');
      done(null, profile.serialize());
    })
    .catch((err) => {
      console.log('Not saved user profile');
      return done(err, null);
    });
};
module.exports = passport;
