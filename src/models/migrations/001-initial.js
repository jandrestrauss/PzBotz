const { DataTypes } = require('sequelize');

module.exports = {
    version: 1,
    name: 'initial',
    up: async (queryInterface) => {
        await queryInterface.createTable('Players', {
            steamId: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            discordId: {
                type: DataTypes.STRING,
                unique: true
            },
            lastSeen: DataTypes.DATE,
            playtime: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        });

        await queryInterface.createTable('ServerConfig', {
            key: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            value: DataTypes.TEXT,
            lastModified: DataTypes.DATE
        });

        await queryInterface.createTable('Backups', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            filename: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            size: DataTypes.BIGINT,
            type: DataTypes.STRING
        });
    }
};
