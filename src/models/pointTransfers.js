const { DataTypes } = require('sequelize');
const database = require('../database');

const PointTransfers = database.sequelize.define('PointTransfers', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fromSteamId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    toSteamId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = PointTransfers;
