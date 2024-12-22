const { DataTypes } = require('sequelize');
const database = require('../database');

const ServerStats = database.sequelize.define('ServerStats', {
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    playerCount: DataTypes.INTEGER,
    cpuUsage: DataTypes.FLOAT,
    memoryUsage: DataTypes.FLOAT,
    tickRate: DataTypes.FLOAT
});

ServerStats.getOverviewStats = async function() {
    const currentStats = await this.findOne({ order: [['timestamp', 'DESC']] });
    const historicalStats = await this.findAll({ limit: 100, order: [['timestamp', 'DESC']] });
    return { current: currentStats, historical: historicalStats };
};

ServerStats.getCurrentStats = async function() {
    return await this.findOne({ order: [['timestamp', 'DESC']] });
};

module.exports = ServerStats;
