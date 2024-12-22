const { DataTypes } = require('sequelize');
const database = require('../database');
const logger = require('./logger');

class AuditLogger {
    constructor() {
        this.setupDatabase();
    }

    async setupDatabase() {
        this.AuditLogs = database.sequelize.define('AuditLogs', {
            action: DataTypes.STRING,
            performedBy: DataTypes.STRING,
            details: DataTypes.TEXT,
            timestamp: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        });

        await this.AuditLogs.sync();
    }

    async log(action, performedBy, details) {
        try {
            await this.AuditLogs.create({
                action,
                performedBy,
                details: JSON.stringify(details)
            });
            logger.info(`Audit log: ${action} by ${performedBy}`);
        } catch (error) {
            logger.error('Failed to create audit log:', error);
        }
    }

    async getRecentLogs(limit = 50) {
        return await this.AuditLogs.findAll({
            order: [['timestamp', 'DESC']],
            limit
        });
    }
}

module.exports = new AuditLogger();
