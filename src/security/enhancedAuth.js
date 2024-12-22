const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('../logging/logger');

class EnhancedAuth {
    constructor() {
        this.tokenBlacklist = new Set();
        this.setupCleanup();
    }

    async validateToken(token) {
        if (this.tokenBlacklist.has(token)) {
            throw new Error('Token has been revoked');
        }

        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            logger.logEvent(`Token validation failed: ${error.message}`);
            throw error;
        }
    }

    setupCleanup() {
        setInterval(() => {
            this.tokenBlacklist.clear();
        }, 24 * 60 * 60 * 1000); // Clear every 24 hours
    }
}

module.exports = new EnhancedAuth();
