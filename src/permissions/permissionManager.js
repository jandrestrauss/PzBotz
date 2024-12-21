const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class PermissionManager {
    constructor() {
        this.permissions = new Map();
        this.roles = {
            OWNER: 'owner',
            ADMIN: 'admin',
            MODERATOR: 'mod',
            USER: 'user'
        };

        this.permissionLevels = {
            [this.roles.OWNER]: 3,
            [this.roles.ADMIN]: 2,
            [this.roles.MODERATOR]: 1,
            [this.roles.USER]: 0
        };

        this.loadPermissions();
    }

    async loadPermissions() {
        try {
            const data = await fs.readFile(path.join(__dirname, '../../data/permissions.json'), 'utf8');
            const perms = JSON.parse(data);
            this.permissions = new Map(Object.entries(perms));
            logger.info('Permissions loaded successfully');
        } catch (error) {
            logger.warn('No permissions file found, creating default');
            await this.savePermissions();
        }
    }

    async savePermissions() {
        try {
            const data = Object.fromEntries(this.permissions);
            await fs.writeFile(
                path.join(__dirname, '../../data/permissions.json'),
                JSON.stringify(data, null, 2)
            );
            logger.info('Permissions saved successfully');
        } catch (error) {
            logger.error('Failed to save permissions:', error);
        }
    }

    hasPermission(userId, requiredRole) {
        const userRole = this.permissions.get(userId) || this.roles.USER;
        return this.permissionLevels[userRole] >= this.permissionLevels[requiredRole];
    }

    async setPermission(userId, role) {
        if (!Object.values(this.roles).includes(role)) {
            throw new Error('Invalid role');
        }
        this.permissions.set(userId, role);
        await this.savePermissions();
        return true;
    }

    getRoles() {
        return Object.values(this.roles);
    }

    getUserRole(userId) {
        return this.permissions.get(userId) || this.roles.USER;
    }
}

module.exports = PermissionManager;
