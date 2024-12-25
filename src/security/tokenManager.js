const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const logger = require('../utils/logger');

class TokenManager {
    constructor() {
        this.rateLimiter = new Map();
        this.tokens = new Map();
        this.algorithm = 'aes-256-gcm';
        this.keyLength = 32;
        this.secret = process.env.TOKEN_SECRET || crypto.randomBytes(32).toString('hex');
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

    generateToken(userId) {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

        const tokenData = {
            token,
            userId,
            expiresAt,
            rotationCount: 0
        };

        this.tokens.set(token, tokenData);
        return this.encryptToken(token);
    }

    encryptToken(token) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secret), iv);
        const encrypted = Buffer.concat([cipher.update(token), cipher.final()]);
        const authTag = cipher.getAuthTag();

        return {
            token: encrypted.toString('hex'),
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }

    validateToken(encryptedData) {
        try {
            const decipher = crypto.createDecipheriv(
                this.algorithm,
                Buffer.from(this.secret),
                Buffer.from(encryptedData.iv, 'hex')
            );
            
            decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
            const decrypted = Buffer.concat([
                decipher.update(Buffer.from(encryptedData.token, 'hex')),
                decipher.final()
            ]);

            const token = decrypted.toString();
            const tokenData = this.tokens.get(token);

            return tokenData && tokenData.expiresAt > Date.now();
        } catch (error) {
            logger.error('Token validation failed:', error);
            return false;
        }
    }
}

module.exports = new TokenManager();