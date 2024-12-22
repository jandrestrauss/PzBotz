const logger = require('../utils/logger');
const User = require('../models/User');
const ServerConfig = require('../models/ServerConfig');
const { AppError } = require('../utils/errorHandler');

class AdminService {
    async getAdminData() {
        const users = await User.find().select('-password');
        const config = await ServerConfig.findOne();
        const logs = await logger.getRecentLogs();

        return { users, config, logs };
    }

    async updateServerConfig(newConfig) {
        try {
            const config = await ServerConfig.findOneAndUpdate(
                {},
                newConfig,
                { new: true, upsert: true }
            );

            logger.logEvent('Server configuration updated');
            return config;
        } catch (error) {
            throw new AppError('Failed to update server configuration', 500);
        }
    }

    async updateUserRole(userId, role) {
        const validRoles = ['admin', 'moderator', 'user'];
        if (!validRoles.includes(role)) {
            throw new AppError('Invalid role', 400);
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        );

        if (!user) throw new AppError('User not found', 404);
        return user;
    }
}

module.exports = new AdminService();
