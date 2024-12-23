exports.up = function(knex) {
  return knex.schema.createTable('posts', table => {
    table.increments('id');
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('content').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('posts');
};
