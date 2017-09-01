// 'use strict';
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
// const TwitterStrategy = require('passport-twitter').Strategy;
// const config = require('config')['passport'];
// const models = require('../../db/models');

// passport.serializeUser((profile, done) => {
//   done(null, profile.id);
// });

// passport.deserializeUser((id, done) => {
//   return models.Profile.where({ id }).fetch()
//     .then(profile => {
//       if (!profile) {
//         throw profile;
//       }
//       done(null, profile.serialize());
//     })
//     .error(error => {
//       done(error, null);
//     })
//     .catch(() => {
//       done(null, null, { message: 'No user found' });
//     });
// });

// passport.use('local-signup', new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password',
//   passReqToCallback: true
// },
//   (req, email, password, done) => {
//     // check to see if there is any account with this email address
//     return models.Profile.where({ email }).fetch()
//       .then(profile => {
//         // create a new profile if a profile does not exist
//         if (!profile) {
//           return models.Profile.forge({ email }).save();
//         }
//         // throw if any auth account already exists
//         if (profile) {
//           throw profile;
//         }

//         return profile;
//       })
//       .tap(profile => {
//         // create a new local auth account with the user's profile id
//         return models.Auth.forge({
//           password,
//           type: 'local',
//           profile_id: profile.get('id')
//         }).save();
//       })
//       .then(profile => {
//         // serialize profile for session
//         done(null, profile.serialize());
//       })
//       .error(error => {
//         done(error, null);
//       })
//       .catch(() => {
//         done(null, false, req.flash('signupMessage', 'An account with this email address already exists.'));
//       });
//   }));

// passport.use('local-login', new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password',
//   passReqToCallback: true
// },
//   (req, email, password, done) => {
//     // fetch any profiles that have a local auth account with this email address
//     return models.Profile.where({ email }).fetch({
//       withRelated: [{
//         auths: query => query.where({ type: 'local' })
//       }]
//     })
//       .then(profile => {
//         // if there is no profile with that email or if there is no local auth account with profile
//         if (!profile || !profile.related('auths').at(0)) {
//           throw profile;
//         }

//         // check password and pass through account
//         return Promise.all([profile, profile.related('auths').at(0).comparePassword(password)]);
//       })
//       .then(([profile, match]) => {
//         if (!match) {
//           throw profile;
//         }
//         // if the password matches, pass on the profile
//         return profile;
//       })
//       .then(profile => {
//         // call done with serialized profile to include in session
//         done(null, profile.serialize());
//       })
//       .error(err => {
//         done(err, null);
//       })
//       .catch(() => {
//         done(null, null, req.flash('loginMessage', 'Incorrect username or password'));
//       });
//   }));

// passport.use('google', new GoogleStrategy({
//   clientID: config.Google.clientID,
//   clientSecret: config.Google.clientSecret,
//   callbackURL: config.Google.callbackURL
// },
//   (accessToken, refreshToken, profile, done) => getOrCreateOAuthProfile('google', profile, done))
// );

// passport.use('facebook', new FacebookStrategy({
//   clientID: config.Facebook.clientID,
//   clientSecret: config.Facebook.clientSecret,
//   callbackURL: config.Facebook.callbackURL,
//   profileFields: ['id', 'emails', 'name']
// },
//   (accessToken, refreshToken, profile, done) => getOrCreateOAuthProfile('facebook', profile, done))
// );

// // REQUIRES PERMISSIONS FROM TWITTER TO OBTAIN USER EMAIL ADDRESSES
// passport.use('twitter', new TwitterStrategy({
//   consumerKey: config.Twitter.consumerKey,
//   consumerSecret: config.Twitter.consumerSecret,
//   callbackURL: config.Twitter.callbackURL,
//   userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true'
// },
//   (accessToken, refreshToken, profile, done) => getOrCreateOAuthProfile('twitter', profile, done))
// );

// const getOrCreateOAuthProfile = (type, oauthProfile, done) => {
//   return models.Auth.where({ type, oauth_id: oauthProfile.id }).fetch({
//     withRelated: ['profile']
//   })
//     .then(oauthAccount => {

//       if (oauthAccount) {
//         throw oauthAccount;
//       }

//       if (!oauthProfile.emails || !oauthProfile.emails.length) {
//         // FB users can register with a phone number, which is not exposed by Passport
//         throw null;
//       }
//       return models.Profile.where({ email: oauthProfile.emails[0].value }).fetch();
//     })
//     .then(profile => {

//       let profileInfo = {
//         first: oauthProfile.name.givenName,
//         last: oauthProfile.name.familyName,
//         display: oauthProfile.displayName || `${oauthProfile.name.givenName} ${oauthProfile.name.familyName}`,
//         email: oauthProfile.emails[0].value
//       };

//       if (profile) {
//         //update profile with info from oauth
//         return profile.save(profileInfo, { method: 'update' });
//       }
//       // otherwise create new profile
//       return models.Profile.forge(profileInfo).save();
//     })
//     .tap(profile => {
//       return models.Auth.forge({
//         type,
//         profile_id: profile.get('id'),
//         oauth_id: oauthProfile.id
//       }).save();
//     })
//     .error(err => {
//       done(err, null);
//     })
//     .catch(oauthAccount => {
//       if (!oauthAccount) {
//         throw oauthAccount;
//       }
//       return oauthAccount.related('profile');
//     })
//     .then(profile => {
//       if (profile) {
//         done(null, profile.serialize());
//       }
//     })
//     .catch(() => {
//       // TODO: This is not working because redirect to login uses req.flash('loginMessage')
//       // and there is no access to req here
//       done(null, null, {
//         'message': 'Signing up requires an email address, \
//           please be sure there is an email address associated with your Facebook account \
//           and grant access when you register.' });
//     });
// };

// module.exports = passport;
