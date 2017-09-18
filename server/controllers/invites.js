const models = require('../../db/models');
const dbhelper = require('../../db/helpers.js');
const helper = require('./helper');
const Promise = require('bluebird');
const crypto = require('crypto');

module.exports.getInvitees = (req, res) => {
  if (helper.checkUndefined(req.params.id)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  var boardId = req.params.id;
  dbhelper.getInviteesByBoard(parseInt(boardId))
    .then((handles) => {
      if (!handles) {
        throw 'couldnt get invitees handles for board';
      }
      res.status(200).send(handles);
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
};

//Invite by Githandle
// module.exports.addInvitees = (req, res) => {
//   if (helper.checkUndefined(req.params.id, req.body.user_handles)) {
//     res.status(400).send('one of parameters from client is undefined');
//     return;
//   }
//   var userHandles = req.body.user_handles; //will it be a proper array????????????????????
//   var boardId = req.params.id;
//   //see which github handles are NOT in the users table
//   var usersExist = [];
//   var createUsers = [];
//   var inviteAll = [];
//   //check if users exist
//   for (var i = 0; i < userHandles.length; i++) {
//     usersExist.push(dbhelper.handleExists(userHandles[i]));
//   }
//   Promise.all(usersExist)
//     .then(() => {
//       //add users that dont exist to users table
//       for (var i = 0; i < userHandles.length; i++) {
//         if (!usersExist[i]) {
//           var buf = crypto.randomBytes(256);
//           var profileInfo = {
//             github_handle: userHandles[i],
//             verified: 0,
//             api_key: buf.toString('hex').slice(0, 64)
//           };
//           createUsers.push(dbhelper.createUser(profileInfo));
//         }
//       }
//       return Promise.all(createUsers);
//     })
//     .then(() => {
//       //invite everyone to the board now
//       for (var i = 0; i < userHandles.length; i++) {
//         inviteAll.push(dbhelper.inviteByBoard(userHandles[i], parseInt(boardId)));
//       }
//       return Promise.all(inviteAll);
//     })
//     .then(() => {
//       res.status(201).send(inviteAll);
//     })
//     .catch(err => {
//       res.status(500).send(JSON.stringify(err));
//     });
// };

//Invite by email
module.exports.addInvitees = (req, res) => {
  if (helper.checkUndefined(req.params.id, req.body.user_emails)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  console.log('req.body', req.body);
  var userEmails = req.body.user_emails;
  var userHandles = [];
  var boardId = req.params.id;
  //see which github handles are NOT in the users table
  var usersExist = [];
  var emailsAreAlreadyOnBoard = [];
  //promise array to create users who don't exist yet
  var createUsers = [];
  var inviteAll = [];
  //check which emails dont exist in the user app at all. those that don't will need to be created
  for (var i = 0; i < userEmails.length; i++) {
    usersExist.push(dbhelper.getUserByEmailNoError(userEmails[i]));
  }
  //check which emails are already members of board
  for (var j = 0; j < userEmails.length; j++) {
    emailsAreAlreadyOnBoard.push(helper.checkIfEmailMemberOfBoardId(userEmails[j], boardId));
  }
  Promise.all(usersExist)
    .then((res) => {
      usersExist = res;
      console.log('usersExist', usersExist);
      return Promise.all(emailsAreAlreadyOnBoard);
    })
    .then((res) => {
      emailsAreAlreadyOnBoard = res;
      console.log('emailsAreAlreadyOnBoard', emailsAreAlreadyOnBoard);
      //add users that dont exist to users table
      for (var i = 0; i < userEmails.length; i++) {
        if (usersExist[i] === 'nonexisting user') {
          var buf = crypto.randomBytes(256);
          var profileInfo = {
            github_handle: userEmails[i],
            email: userEmails[i],
            verified: 0,
            api_key: buf.toString('hex').slice(0, 64)
          };
          createUsers.push(dbhelper.createUser(profileInfo));
        }
      }
      return Promise.all(createUsers);
    })
    .then((res) => {
      createUsers = res;
      var addVerifiedUsersNotInBoard = [];
      for (var i = 0; i < userEmails.length; i++) {
        console.log('each user is ', usersExist[i]);
        if (usersExist[i].verified && usersExist[i].verified === 1 && emailsAreAlreadyOnBoard[i] !== true) {
          console.log('user is verified and needs to be added to board UserId', usersExist[i]);
          //go ahead and add to board as long as user is a verified member of app and not already member of board
          addVerifiedUsersNotInBoard.push(db.addUserToBoard(usersExist[i].id, boardId));
        }
      }
      return Promise.all(addVerifiedUsersNotInBoard);
    })
    .then((res) => {
      addVerifiedUsersNotInBoard = res;
      console.log('createUsers', createUsers);
      //invite everyone to the board now
      for (var i = 0; i < userEmails.length; i++) {
        if (emailsAreAlreadyOnBoard[i] === true) {
          inviteAll.push('already member');
        } else {
          //invite non-members to join the app or notify verified members that they were added to group
          inviteAll.push(dbhelper.inviteEmailByBoard(userEmails[i], parseInt(boardId)));
        }
      }
      return Promise.all(inviteAll);
    })
    .then((response) => {
      inviteAll = response;
      console.log('inviteAll', inviteAll);
      res.status(201).send(inviteAll);
    })
    .catch(err => {
      console.log('error during invite', err);
      res.status(500).send(JSON.stringify(err));
    });
};

module.exports.deleteInvitees = (req, res) => {
  if (helper.checkUndefined(req.params.id, req.body.user_handles)) {
    res.status(400).send('one of parameters from client is undefined');
    return;
  }
  var userHandles = req.body.user_handles; //will it be a proper array????????????????????
  var boardId = req.params.id;
  //see which github handles are NOT in the users table
  var deviteAll = [];
  for (var i = 0; i < userHandles.length; i++) {
    deviteAll.push(dbhelper.uninviteByBoard(userHandles[i], parseInt(boardId)));
  }
  Promise.all(deviteAll)
    .then(() => {
      res.status(201).send(deviteAll);
    })
    .catch(err => {
      res.status(500).send(JSON.stringify(err));
    });
};