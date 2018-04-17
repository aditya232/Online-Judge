exports.up = function(knex, Promise) {
return knex.schema.createTable('user', function (t) {
    t.increments('id').primary();
    t.string('username').notNullable();
    t.string('password').notNullable();
    t.string('email').notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  })  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user');
};
