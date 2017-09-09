const express = require('express');
const middleware = require('../middleware');

const router = express.Router();

//this is for testing purposes only to set up fake user session
if (process.env.NODE_ENV === 'test') {
  var fakeUser1 = {
    'id': 1,
    'email': null,
    'github_handle': 'stevepkuo',
    'profile_photo': 'https://avatars0.githubusercontent.com/u/14355395?v=5',
    'oauth_id': '14355395',
    'lastboard_id': null
  };
  var fakeUser2 = {
    'id': 2,
    'email': null,
    'github_handle': 'stevepkuo2',
    'profile_photo': 'https://avatars0.githubusercontent.com/u/14355396?v=5',
    'oauth_id': '14355396',
    'lastboard_id': null
  };
  var fakeUser3 = {
    'id': 3,
    'email': null,
    'github_handle': 'dsc03',
    'profile_photo': 'https://avatars0.githubusercontent.com/u/25214199?v=4',
    'oauth_id': '25214199',
    'lastboard_id': null
  };
  router.use(middleware.auth.fakemiddleware);
  router.route('/auth/fake')
    .get((req, res) => {
      req.session = req.session || {};  
      req.session.user_tmp = fakeUser1;
      //res.redirect('/');
      res.status(200).send();
    });
  router.route('/auth/fake2')
    .get((req, res) => {
      req.session = req.session || {};  
      req.session.user_tmp = fakeUser2;
      //res.redirect('/');
      res.status(200).send();
    });
  router.route('/auth/fake3')
    .get((req, res) => {
      req.session = req.session || {};  
      req.session.user_tmp = fakeUser3;
      //res.redirect('/');
      res.status(200).send();
    });
}

router.route('/')
  .get(middleware.auth.verify, (req, res) => {
    res.render('index.ejs');
  });

router.route('/login')
  .get((req, res) => {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

router.route('/signup')
  .get((req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

/** ROUTE USED TO RETRIEVE AND SEND USER DATA BACK TO CLIENT **/
router.route('/profile')
  .get(middleware.auth.verify, (req, res) => {
    res.send(req.user);
  });

router.route('/logout')
  .get((req, res) => {
    req.logout();
    res.redirect('/');
  });

router.get('/auth/github', middleware.passport.authenticate('github'));

router.get('/auth/github/callback', middleware.passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router;
