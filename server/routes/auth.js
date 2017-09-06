const express = require('express');
const middleware = require('../middleware');

const router = express.Router();

router.route('/')
  .get(middleware.auth.verify, (req, res) => {
    res.render('index.ejs');
  });

router.route('/login')
  .get((req, res) => {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });
// .post(middleware.passport.authenticate('local-login', {
//   successRedirect: '/profile',
//   failureRedirect: '/login',
//   failureFlash: true
// }));

router.route('/signup')
  .get((req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });
// .post(middleware.passport.authenticate('local-signup', {
//   successRedirect: '/profile',
//   failureRedirect: '/signup',
//   failureFlash: true
// }));

/** ROUTE USED TO RETRIEVE AND SEND USER DATA BACK TO CLIENT **/
router.route('/profile')
  .get(middleware.auth.verify, (req, res) => {
    res.send(req.user[0]);
  });

router.route('/logout')
  .get((req, res) => {
    req.logout();
    res.redirect('/');
  });

// router.get('/auth/google', middleware.passport.authenticate('google', {
//   scope: ['email', 'profile']
// }));

// router.get('/auth/google/callback', middleware.passport.authenticate('google', {
//   successRedirect: '/profile',
//   failureRedirect: '/login'
// }));

// router.get('/auth/facebook', middleware.passport.authenticate('facebook', {
//   scope: ['public_profile', 'email']
// }));

// router.get('/auth/facebook/callback', middleware.passport.authenticate('facebook', {
//   successRedirect: '/profile',
//   failureRedirect: '/login',
//   failureFlash: true
// }));

// router.get('/auth/twitter', middleware.passport.authenticate('twitter'));

// router.get('/auth/twitter/callback', middleware.passport.authenticate('twitter', {
//   successRedirect: '/profile',
//   failureRedirect: '/login'
// }));

router.get('/auth/github', middleware.passport.authenticate('github'));

router.get('/auth/github/callback', middleware.passport.authenticate('github', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));

module.exports = router;
