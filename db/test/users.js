const db = require('../db');
const {expect} = require('chai');

describe('User Schema', () => {
  beforeEach((done) => {
    db.sync({force: true})
      .then(() => {
        done();
      });
  });

  it('inserts new users', (done) => {
    User.forge(data).save()
      .then(user => {
        expect(user.id).to.exist;
        expect(user.steamId).to.exist;
        expect(user.steamAvatarImageUrl).to.exist;
        expect(user.steamProfileUrl).to.exist;
        expect(user.steamScreenName).to.exist;
        expect(user.steamRealName).to.exist;
        done();
      });
  });
});