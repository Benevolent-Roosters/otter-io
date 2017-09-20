const express = require('express');
const middleware = require('../middleware');
const dbhelper = require('../../db/helpers.js');
const helper = require('../controllers/helper');
const Promise = require('bluebird');

const router = express.Router();

//this is for testing purposes only to set up fake user session
if (process.env.NODE_ENV === 'test') {
  var fakeUser1 = {
    'id': 1,
    'email': null,
    'github_handle': 'stevepkuo',
    'profile_photo': 'https://avatars0.githubusercontent.com/u/14355395?v=5',
    'oauth_id': '14355395',
    'lastboard_id': null,
    'api_key': 'fish'
  };
  var fakeUser2 = {
    'id': 2,
    'email': null,
    'github_handle': 'stevepkuo2',
    'profile_photo': 'https://avatars0.githubusercontent.com/u/14355396?v=5',
    'oauth_id': '14355396',
    'lastboard_id': null,
    'api_key': 'dog'
  };
  var fakeUser3 = {
    'id': 3,
    'email': null,
    'github_handle': 'dsc03',
    'profile_photo': 'https://avatars0.githubusercontent.com/u/25214199?v=4',
    'oauth_id': '25214199',
    'lastboard_id': null,
    'api_key': 'cat'
  };
  var fakeUser4 = {
    'id': 4,
    'email': 'newnew@aol.com',
    'github_handle': 'newnew@aol.com',
    'profile_photo': null,
    'oauth_id': null,
    'lastboard_id': null,
    'verified': 0
  };
  router.use(middleware.auth.fakemiddleware);
  router.route('/auth/fake')
    .get((req, res) => {
      req.session = req.session || {};  
      req.session.user_tmp = fakeUser1;
      res.status(200).send();
    });
  router.route('/auth/fake2')
    .get((req, res) => {
      req.session = req.session || {};  
      req.session.user_tmp = fakeUser2;
      res.status(200).send();
    });
  router.route('/auth/fake3')
    .get((req, res) => {
      req.session = req.session || {};  
      req.session.user_tmp = fakeUser3;
      res.status(200).send();
    });
  router.route('/auth/fake4')
    .get((req, res) => {
      req.session = req.session || {};  
      req.session.user_tmp = fakeUser4;
      res.status(200).send();
    });
}

//This is the main route to serve up the main page
//Has a mechanism to add new users to boards they were invited to if they have a special
//cookie from clicking an email invite link
router.route('/')
  .get(middleware.auth.verify, (req, res) => {
    var userId = req.user.id;
    //this part is for new users who previously clicked on invitation link to join our app and add invited boards
    if (req.cookies.claimcode) {
      console.log('claim code is:', req.cookies.claimcode);
      var claimcode = req.cookies.claimcode;
      var invitedInviteIDs = [];
      var dummyId;
      //use claimcode to get associated invite email/github_handle
      dbhelper.getUserByApiKey(claimcode)
        .then(dummyuser => {
          if (!dummyuser) {
            throw dummyuser;
          }
          dummyId = dummyuser.id;
          //then use email/gihub_handle to get associated invite boards
          return dbhelper.getInvitesByUser(dummyuser.id);
        })
        .then(boards => {
          if (!boards) {
            throw boards;
          }
          invitedInviteIDs = boards.map(eachBoard => eachBoard._pivot_id);
          var addBoardPromises = [];
          for (var i = 0; i < boards.length; i++) {
            //add current user to each of the associated invite boards
            addBoardPromises.push(dbhelper.addUserToBoard(userId, boards[i].id));
          }
          return Promise.all(addBoardPromises);
        })
        .then(resolvedAddBoards => {
          //delete those invites now that user has been added to them
          return dbhelper.deleteInvites(invitedInviteIDs);
        })
        .then(deleteResult => {
          if (!(deleteResult === 'success')) {
            throw deleteResult;
          }
          //delete the dummy user entry for the invite email
          return dbhelper.delUserById(dummyId);
        })
        .then(deleteresult => {
          //remove the cookie
          res.clearCookie('claimcode');
          res.render('index.ejs');
        })
        .catch((err) => {
          res.clearCookie('claimcode');
          res.status(500).send(JSON.stringify(err));
        });
    } else {
      res.render('index.ejs');
    }
  });

router.route('/login')
  .get((req, res) => {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

router.route('/signup')
  .get((req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

//for new users who clicked on an email invitation link to join our app and be added to invited boards
//claim code will be added to user cookie
//it will be used when they visit the main page to add them to their invited boards
router.route('/signup/:claimcode')
  .get((req, res) => {
    var claimcode = req.params.claimcode;
    //check that claim code is valid
    dbhelper.getUserByApiKey(claimcode)
      .then(user => {
        if (!user) {
          throw user;
        }
        //this cookie will help add boards associated with claim code once user has signed up and visited the site again
        res.cookie('claimcode', claimcode, { maxAge: 900000, httpOnly: true });
        res.redirect('/signup');
      })
      .catch((err) => {
        console.log('error during claim code', claimcode);
        res.status(404).send('not valid claim code');
      });
  });

/** ROUTE USED TO RETRIEVE AND UPDATE USER DATA **/
router.route('/profile')
  .get(middleware.auth.verifyElse401, (req, res) => {
    dbhelper.getUserByIdUnhidden(parseInt(req.user.id))
      .then(user => {
        if (!user) {
          throw user;
        }
        res.status(200).send(user);
      })
      .catch((err) => {
        res.status(500).send(JSON.stringify(err));
      });
  })
  .put(middleware.auth.verifyElse401, (req, res) => {
    if (helper.checkUndefined(req.body)) {
      console.log('stuff happened');
      res.status(400).send('one of parameters from client is undefined');
      return;
    }
    var userObj = req.body;
    var validKeys = {
      'id': true,
      'email': true,
      'github_handle': true,
      'profile_photo': true,
      'oauth_id': true,
      'lastboard_id': true
    };
    for (var key in userObj) {
      if (userObj.hasOwnProperty(key)) {
        if (!(key in validKeys)) {
          res.status(400).send(`${key} not a valid field`);
          return;
        }
      }
    }
    var userId = userObj.id;
    if (!userId) {
      res.status(400).send(`Update user object ${JSON.stringify(userId)} doesnt have id field`);
      return;
    }
    if (parseInt(req.body.id) !== req.user.id) {
      res.status(400).send('id field from client doesnt match actual logged in user');
      return;
    }
    dbhelper.updateUserById(parseInt(userId), userObj)
      .then(user => {
        if (!user) {
          throw user;
        }
        res.status(201).send(user);
      })
      .catch((err) => {
        res.status(500).send(JSON.stringify(err));
      });

  });

/** ROUTE USED TO RETRIEVE USER INVITES **/
router.route('/profile/invitations')
  .get(middleware.auth.verifyElse401, (req, res) => {
    dbhelper.getInvitesByUser(parseInt(req.user.id))
      .then(invites => {
        if (!invites) {
          throw invites;
        }
        res.status(200).send(invites);
      })
      .catch((err) => {
        res.status(500).send(JSON.stringify(err));
      });
  });

/** ROUTE TO SERVE UP PROFILE PAGE **/
router.route('/myprofile')
  .get(middleware.auth.verifyElse401, (req, res) => {
    var user;
    //Get unhidden info about user including api_key
    dbhelper.getUserByIdUnhidden(parseInt(req.user.id))
      .then(userUnhidden => {
        if (!userUnhidden) {
          throw userUnhidden;
        }
        user = userUnhidden;
        //get my invitations and display them
        //THIS MIGHT BE DEPRECATED, SINCE MEMBERS ARE AUTO-ADDED TO BOARDS
        //INVITES WILL BE AUTO CLEARED BY EMAIL NOTIFICATION WORKER IN THE BACKGROUND
        return dbhelper.getInvitesByUser(parseInt(req.user.id));
      })
      .then(invites => {
        if (!invites) {
          throw invites;
        }
        res.render('profile.ejs', {
          user: user, // get the user with api key from dbhelper and pass to template
          invites: invites //pass in the boards that user is invited to
        });
      })
      .catch((err) => {
        res.status(500).send(JSONstringify(err));
      });
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