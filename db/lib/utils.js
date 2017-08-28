const knex = require('knex')(require('../../knexfile'));

exports.rollbackMigrate = (done) => {
  knex.migrate.rollback()
    .then(function () {
      return knex.migrate.latest();
    })
    .then(function () {
      return knex.seed.run();
    })
    .then(function () {
      done();
    })
    .catch(function (err) {
      console.log('error in migration:', err);
      done();
    });
};

exports.rollback = (done) => {
  knex.migrate.rollback()
    .then(function () {
      done();
    })
    .catch(function (err) {
      console.log('err in migration afterEach');
      done();
    });
};