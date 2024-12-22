const { DataTypes } = require('sequelize');
const database = require('../database');

const PlayerStats = database.sequelize.define('PlayerStats', {
    steamId: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    lastSeen: DataTypes.DATE,
    playtime: DataTypes.INTEGER,
    zombieKills: DataTypes.INTEGER,
    deaths: DataTypes.INTEGER,
    pvpKills: DataTypes.INTEGER,
    level: DataTypes.INTEGER,
    experience: DataTypes.INTEGER,
    reputation: DataTypes.INTEGER
});

module.exports = PlayerStats;
