const jwt = require('jsonwebtoken');
const logger = require('../logging/logger');

class TokenManager {
    constructor() {
        this.rateLimiter = new Map();
    }

    async checkRateLimit(key, limit = 100, window = 3600) {
        const now = Date.now();
        const userAttempts = this.rateLimiter.get(key) || [];
        
        // Clean up old attempts
        const validAttempts = userAttempts.filter(timestamp => 
            now - timestamp < window * 1000
        );
        
        if (validAttempts.length >= limit) {
            throw new Error('Rate limit exceeded');
        }
        
        validAttempts.push(now);
        this.rateLimiter.set(key, validAttempts);
        
        return validAttempts.length;
    }

    cleanupExpiredTokens(tokenBlacklist) {
        const now = Date.now();
        const expiredTokens = Array.from(tokenBlacklist).filter(token => {
            try {
                const decoded = jwt.decode(token);
                return decoded && decoded.exp * 1000 < now;
            } catch (error) {
                logger.logEvent('Invalid token removed from blacklist', { error: error.message });
                return true; // Remove invalid tokens
            }
        });
        
        expiredTokens.forEach(token => tokenBlacklist.delete(token));
        logger.logEvent('Token cleanup completed', { 
            removed: expiredTokens.length,
            remaining: tokenBlacklist.size
        });
    }
}

module.exports = TokenManager;