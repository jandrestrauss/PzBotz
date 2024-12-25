const knex = require('knex');
const config = require('../config/config');

const db = knex({
    client: 'pg',
    connection: {
        host: config.get('dbHost'),
        user: config.get('dbUser'),
        password: config.get('dbPassword'),
        database: config.get('dbName')
    }
});

async function initializeDatabase() {
    try {
        await db.schema.createTable('players', table => {
            table.string('id').primary();
            table.string('username').notNullable();
            table.integer('points').defaultTo(0);
            table.timestamp('lastSeen').defaultTo(db.fn.now());
            table.boolean('banned').defaultTo(false);
            table.string('banReason');
        });

        await db.schema.createTable('transactions', table => {
            table.increments('id').primary();
            table.string('playerId').references('id').inTable('players');
            table.string('type').notNullable();
            table.integer('amount').notNullable();
            table.timestamp('createdAt').defaultTo(db.fn.now());
        });

        await db.schema.createTable('items', table => {
            table.string('id').primary();
            table.string('name').notNullable();
            table.integer('cost').notNullable();
            table.integer('quantity').defaultTo(1);
        });

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
}

async function getPlayerById(id) {
    return await db('players').where({ id }).first();
}

async function addPlayer(player) {
    return await db('players').insert(player);
}

async function updatePlayer(id, updates) {
    return await db('players').where({ id }).update(updates);
}

async function deletePlayer(id) {
    return await db('players').where({ id }).del();
}

async function getAllPlayers() {
    return await db('players').select();
}

async function getTransactionsByPlayerId(playerId) {
    return await db('transactions').where({ playerId }).select();
}

async function addTransaction(transaction) {
    return await db('transactions').insert(transaction);
}

async function getAllItems() {
    return await db('items').select();
}

async function addItem(item) {
    return await db('items').insert(item);
}

async function updateItem(id, updates) {
    return await db('items').where({ id }).update(updates);
}

async function deleteItem(id) {
    return await db('items').where({ id }).del();
}

async function getPlayerByUsername(username) {
    return await db('players').where({ username }).first();
}

async function getPlayersByPoints(minPoints) {
    return await db('players').where('points', '>=', minPoints).select();
}

async function getRecentTransactions(limit = 10) {
    return await db('transactions').orderBy('createdAt', 'desc').limit(limit).select();
}

async function getItemsByCostRange(minCost, maxCost) {
    return await db('items').whereBetween('cost', [minCost, maxCost]).select();
}

async function getPlayerStats() {
    return await db('players')
        .select('username', 'points', 'lastSeen')
        .orderBy('points', 'desc');
}

async function getTopPlayers(limit = 10) {
    return await db('players')
        .orderBy('points', 'desc')
        .limit(limit)
        .select('username', 'points');
}

async function getBannedPlayers() {
    return await db('players')
        .where('banned', true)
        .select('username', 'banReason');
}

async function getPlayerCount() {
    return await db('players').count('id as count').first();
}

async function getTransactionCount() {
    return await db('transactions').count('id as count').first();
}

async function getItemCount() {
    return await db('items').count('id as count').first();
}

async function getAggregatedPlayerStats() {
    return await db('players')
        .select(db.raw('count(*) as totalPlayers, avg(points) as avgPoints, max(points) as maxPoints'))
        .first();
}

async function getTransactionSummary() {
    return await db('transactions')
        .select(db.raw('count(*) as totalTransactions, sum(amount) as totalAmount'))
        .first();
}

async function getHistoricalData(table, startDate, endDate) {
    return await db(table)
        .whereBetween('createdAt', [startDate, endDate])
        .select();
}

async function getPlayerActivity(playerId, startDate, endDate) {
    return await db('transactions')
        .where({ playerId })
        .andWhereBetween('createdAt', [startDate, endDate])
        .select();
}

async function getTopItems(limit = 10) {
    return await db('items')
        .orderBy('cost', 'desc')
        .limit(limit)
        .select('name', 'cost');
}

async function getPlayerTransactionSummary(playerId) {
    return await db('transactions')
        .where({ playerId })
        .select(db.raw('count(*) as totalTransactions, sum(amount) as totalAmount'))
        .first();
}

module.exports = {
    db,
    initializeDatabase,
    getPlayerById,
    addPlayer,
    updatePlayer,
    deletePlayer,
    getAllPlayers,
    getTransactionsByPlayerId,
    addTransaction,
    getAllItems,
    addItem,
    updateItem,
    deleteItem,
    getPlayerByUsername,
    getPlayersByPoints,
    getRecentTransactions,
    getItemsByCostRange,
    getPlayerStats,
    getTopPlayers,
    getBannedPlayers,
    getPlayerCount,
    getTransactionCount,
    getItemCount,
    getAggregatedPlayerStats,
    getTransactionSummary,
    getHistoricalData,
    getPlayerActivity,
    getTopItems,
    getPlayerTransactionSummary
};
