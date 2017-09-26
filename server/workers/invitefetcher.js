const dbhelper = require('../../db/helpers.js');
const helper = require('../controllers/helper');
const emailhelper = require('./helper.js');
const Promise = require('bluebird');

//let existing member know they have been added to Boards
exports.notifyworker = function() {
  //get list of members who were recently added to boards
  var results;
  dbhelper.getRecentlyAdded()
    .then((recentlyadded) => {
      results = recentlyadded;
      //email them here
      if (results.length > 0) {
        console.log('these people were recently added to boards...', results);
      }

      var emailMessages = emailhelper.composeEmails(results);
      var emailPromises = [];
      results.forEach((eachUser, index) => {
        //console.log('eachUser', eachUser);
        //console.log('eachUser message', emailMessages[index]);
        emailPromises.push(emailhelper.sendMail(eachUser.email, emailMessages[index], 'https://otter-io.herokuapp.com/'));
      });
      return Promise.all(emailPromises);
    })
    .then((fulfilledEmails) => {
      var inviteIDsToDelete = emailhelper.extractInviteIDs(results);
      if (inviteIDsToDelete.length > 0) {
        console.log('emails sent');
        console.log('these are the inviteIDs to delete...', inviteIDsToDelete);
      }
      return dbhelper.deleteInvites(inviteIDsToDelete);
    })
    .then((resolvedDel) => {
      if (!(resolvedDel === 'success') && !(resolvedDel === 'empty')) {
        throw resolvedDel;
      }
    })
    .catch(err => {
      console.log('error', err);
    });
};

//let new emails know they have been invited to Otter and the Boards
exports.inviteworker = function() {
  //get list of emails who were recently invited to Otter and the Boards
  var results;
  dbhelper.getInvitees(true)
    .then((recentlyinvited) => {
      results = recentlyinvited;
      //email them here
      if (results.length > 0) {
        console.log('these people were recently invited to boards...', results);
      }

      var emailMessages = emailhelper.composeInvites(results);
      var emailPromises = [];
      results.forEach((eachUser, index) => {
        //console.log('eachUser', eachUser);
        //console.log('eachUser email', eachUser.email);
        //console.log('eachUser message', emailMessages[index]);
        emailPromises.push(emailhelper.sendMail(eachUser.email, emailMessages[index].message, emailMessages[index].inviteURL));
      });
      return Promise.all(emailPromises);
    })
    .then((fulfilledEmails) => {
      var inviteIDsToMarkEmailed = emailhelper.extractInviteIDs(results);
      if (inviteIDsToMarkEmailed.length > 0) {
        console.log('emails sent');
        console.log('these are the inviteIDs to mark as emailed...', inviteIDsToMarkEmailed);
      }
      return dbhelper.emailedInvites(inviteIDsToMarkEmailed);
    })
    .then((updated) => {
      if (!(updated === 'success') && !(updated === 'empty')) {
        throw updated;
      }
    })
    .catch(err => {
      console.log('error', err);
    });
};