const config = require('config')['gmail'];
const nodemailer = require('nodemailer');
const Promise = require('bluebird');
var EmailTemplate = require('email-templates');
var path = require('path');
var templatesDir = path.resolve(__dirname, '..', 'views');

exports.generateHTMLfromSemicolon = function(messages) {
  var allLines = messages.split(';');
  var html = '';
  allLines.forEach(eachLine => {
    html += `<div>${eachLine}</div>`;
  });
  return html;
};
exports.generateArrayfromSemicolon = function(messages) {
  return messages.split(';');
};

exports.sendMail = function (toEmail, messages, mainButtonURL) {

  var transporter;

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.client_user,
      clientId: config.clientId,
      clientSecret: config.clientsecret,
      refreshToken: config.refreshtoken,
      accessToken: config.accesstoken
    }
  });

  var locals = {
    messageArray: exports.generateArrayfromSemicolon(messages),
    mainURL: mainButtonURL
  };
  return new Promise(function(res, rej) {
    EmailTemplate(templatesDir, function(err, template) {
      if (err) {
        rej(err);
      }
      console.log(template);
      template('Newsletter', locals, function(error, html, text) {
        if (error) {
          rej(error);
        }
        if (process.env.NODE_ENV === 'test') {
          res('Sent: 250 2.0.0 OK number blah.171 - gsmtp');
        }
        var emailmessage = {
          from: `Otter <otterboards@gmail.com>`,
          to: toEmail, // comma separated list
          subject: 'From your friendly Otter',
          text: messages,
          html: html
        };
        transporter.sendMail(emailmessage, function(error, info) {
          if (error) {
            console.log(error);
            console.log('Didnt send: ', error);
            rej(error);
          } else {
            console.log('Sent: ' + info.response);
            res(info);
          }
        });
      });
    });
  });
};

exports.extractInviteIDs = (usersAndTheirInvites) => {
  var inviteIDs = [];
  usersAndTheirInvites.forEach(eachUser => {
    eachUser.invitedToBoards.forEach(eachInviteBoard => {
      console.log(eachInviteBoard);
      inviteIDs.push(eachInviteBoard._pivot_id);
    });
  });
  return inviteIDs;
};

//This is to notify existing members that they were added to boards
exports.composeEmails = function(usersAndTheirInvites) {
  var emails = [];
  usersAndTheirInvites.forEach(eachUser => {
    var eachUserEmailMessage = 'You have been added to the following Otter project boards...;';
    eachUser.invitedToBoards.forEach(eachInviteBoard => {
      eachUserEmailMessage += `;Otter Board Name: ${eachInviteBoard.board_name};`;
      eachUserEmailMessage += `Github Repo URL: ${eachInviteBoard.repo_url};`;
    });
    emails.push(eachUserEmailMessage);
  });
  return emails;
};

//This is the notify non-members that they were invited to boards
exports.composeInvites = function(usersAndTheirInvites) {
  var emails = [];
  usersAndTheirInvites.forEach(eachUser => {
    var eachUserEmailMessage = 'You have been invited to the following Otter project boards...;';
    eachUser.invitedToBoards.forEach(eachInviteBoard => {
      eachUserEmailMessage += `;Otter Board Name: ${eachInviteBoard.board_name};`;
      eachUserEmailMessage += `Github Repo URL: ${eachInviteBoard.repo_url};`;
    });
    eachUserEmailMessage += 'Sign up and add these boards by clicking the following link;';
    emails.push({message: eachUserEmailMessage, inviteURL: `https://otter-io.herokuapp.com/signup/${eachUser.api_key}`});
  });
  return emails;
};