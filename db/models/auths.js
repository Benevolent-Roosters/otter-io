const db = require('../');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

const Auth = db.Model.extend({
  tableName: 'auths',
  profile: function() {
    return this.belongsTo('Profile');
  },

  initialize: function() {
    this.on('saving', (user, attrs, options) => {
      if (user.get('type') === 'local') {
        return this.generatePassword(user.get('password'))
          .then(hash => {
            this.set('password', hash);
          })
          .error(err => console.log(err));
      }
    });
  },

  comparePassword: function(attempted) {
    return bcrypt.compareAsync(attempted, this.get('password'));
  },

  generatePassword: function(password) {
    return bcrypt.genSaltAsync(null)
      .then(salt => {
        this.set('salt', salt);
        return bcrypt.hashAsync(password, salt, null);
      });
  }
});

module.exports = db.model('Auth', Auth);
