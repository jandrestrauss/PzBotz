const knex = require('knex');
const config = require('../config/config');

const schema = {
    players: table => {
        table.string('id').primary();
        table.string('username').notNullable();
        table.integer('points').defaultTo(0);
        table.timestamp('lastSeen').defaultTo(knex.fn.now());
        table.boolean('banned').defaultTo(false);
        table.string('banReason');
    },

    transactions: table => {
        table.increments('id').primary();
        table.string('playerId').references('id').inTable('players');
        table.string('type').notNullable();
        table.integer('amount').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
    },

    items: table => {
        table.string('id').primary();
        table.string('name').notNullable();
        table.integer('cost').notNullable();
        table.integer('quantity').defaultTo(1);
    }
};

module.exports = schema;
