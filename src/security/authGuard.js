const logger = require('../utils/logger');

class AuthGuard {
    constructor() {
        this.permissionCache = new Map();
        this.roleHierarchy = {
            OWNER: 3,
            ADMIN: 2,
            MOD: 1,
            USER: 0
        };
    }

    async checkPermission(userId, command, context) {
        try {
            const cacheKey = `${userId}-${command}`;
            if (this.permissionCache.has(cacheKey)) {
                return this.permissionCache.get(cacheKey);
            }

            const userRole = await this.getUserRole(userId);
            const requiredRole = this.getRequiredRole(command);

            const hasPermission = this.roleHierarchy[userRole] >= this.roleHierarchy[requiredRole];
            this.permissionCache.set(cacheKey, hasPermission);

            if (!hasPermission) {
                logger.warn(`Permission denied: ${userId} attempted ${command}`);
            }

            return hasPermission;
        } catch (error) {
            logger.error('Permission check failed:', error);
            return false;
        }
    }

    clearCache(userId) {
        for (const key of this.permissionCache.keys()) {
            if (key.startsWith(userId)) {
                this.permissionCache.delete(key);
            }
        }
    }
}

module.exports = new AuthGuard();
