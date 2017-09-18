
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table) {
      table.string('oauth_id', 30).nullable().unique();
      table.integer('lastboard_id').references('boards.id').onDelete('CASCADE');
      table.string('api_key', 64).notNullable().unique(); 
    }),
    knex.schema.dropTableIfExists('auths'),
    knex.schema.dropTableIfExists('profiles')
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('profiles', function (table) {
      table.increments('id').unsigned().primary();
      table.string('first', 100).nullable();
      table.string('last', 100).nullable();
      table.string('display', 100).nullable();
      table.string('email', 100).nullable().unique();
      table.string('phone', 100).nullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTableIfNotExists('auths', function(table) {
      table.increments('id').unsigned().primary();
      table.string('type', 8).notNullable();
      table.string('oauth_id', 30).nullable();
      table.string('password', 100).nullable();
      table.string('salt', 100).nullable();
      table.integer('profile_id').references('profiles.id').onDelete('CASCADE');
    }),
    knex.schema.table('users', function(table) {
      table.dropColumn('api_key');
      table.dropColumn('lastboard_id');
      table.dropColumn('oauth_id');
    })
  ]);
};
