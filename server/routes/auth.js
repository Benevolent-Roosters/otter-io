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

router.route('/signup')
  .get((req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

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

router.get('/auth/github', middleware.passport.authenticate('github'));

router.get('/auth/github/callback', middleware.passport.authenticate('github', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));

module.exports = router;
