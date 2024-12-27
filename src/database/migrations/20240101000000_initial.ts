import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('servers', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('ip').notNullable();
      table.integer('port').notNullable();
      table.integer('rcon_port').notNullable();
      table.string('rcon_password').notNullable();
      table.enum('status', ['online', 'offline']).defaultTo('offline');
      table.timestamps(true, true);
    })
    .createTable('players', (table) => {
      table.increments('id').primary();
      table.string('steam_id').notNullable().unique();
      table.string('discord_id').unique();
      table.string('username').notNullable();
      table.timestamp('last_seen').defaultTo(knex.fn.now());
      table.integer('playtime').defaultTo(0);
      table.integer('server_id').references('id').inTable('servers');
      table.timestamps(true, true);
    })
    .createTable('server_stats', (table) => {
      table.increments('id').primary();
      table.integer('server_id').references('id').inTable('servers');
      table.integer('players_online').defaultTo(0);
      table.float('cpu_usage').defaultTo(0);
      table.float('memory_usage').defaultTo(0);
      table.timestamp('timestamp').defaultTo(knex.fn.now());
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTable('server_stats')
    .dropTable('players')
    .dropTable('servers');
}
