const models = require('../models');

exports.seed = function (knex, Promise) {

  return models.User.where({ github_handle: 'stevepkuo' }).fetch()
    .then((profile) => {
      if (profile) {
        throw profile;
      }
      return models.User.forge({
        github_handle: 'stevepkuo',
        profile_photo: 'https://avatars0.githubusercontent.com/u/14355395?v=4',
        oauth_id: '14355395'
      }).save();
    })
    .error(err => {
      console.error('ERROR: failed to create profile');
      throw err;
    })
    .catch(() => {
      console.log('WARNING: defualt user already exists.');
    });

};
