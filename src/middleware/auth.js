const logger = require('../utils/logger');

class AuthMiddleware {
    constructor(client) {
        this.client = client;
        this.roles = {
            ADMIN: 'admin',
            MODERATOR: 'moderator',
            USER: 'user'
        };
    }

    checkRole(member, requiredRole) {
        const roleMap = {
            [this.roles.ADMIN]: member.hasPermission('ADMINISTRATOR'),
            [this.roles.MODERATOR]: member.hasPermission('MANAGE_MESSAGES'),
            [this.roles.USER]: true
        };

        return roleMap[requiredRole] || false;
    }

    requireRole(role) {
        return async (message, args) => {
            if (!this.checkRole(message.member, role)) {
                logger.warn(`Access denied for ${message.author.tag} - insufficient permissions`);
                await message.reply('You do not have permission to use this command.');
                return false;
            }
            return true;
        };
    }

    async validateCommand(message, command) {
        const commandConfig = this.client.commands.get(command);
        if (!commandConfig) return true;

        if (commandConfig.requiredRole) {
            return this.requireRole(commandConfig.requiredRole)(message);
        }

        return true;
    }
}

module.exports = AuthMiddleware;
