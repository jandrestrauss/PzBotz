const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('../logging/logger');
const TokenManager = require('./tokenManager');
const EnhancedErrorHandler = require('../errorHandling/enhancedErrorHandler');

class EnhancedAuth {
    constructor() {
        this.tokenBlacklist = new Set();
        this.tokenManager = new TokenManager();
        this.errorHandler = new EnhancedErrorHandler();
        this.setupCleanup();
    }

    async validateToken(token) {
        try {
            if (this.tokenBlacklist.has(token)) {
                throw new Error('Token has been revoked');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            if (!decoded.iat) throw new Error('Token missing issued at time');
            if (!decoded.exp) throw new Error('Token missing expiration time');
            if (decoded.exp * 1000 < Date.now()) throw new Error('Token has expired');
            
            const userKey = decoded.sub || decoded.userId;
            await this.tokenManager.checkRateLimit(`auth:${userKey}:attempts`);
            
            logger.info('Token validation successful', {
                user: userKey,
                tokenType: decoded.type,
                timestamp: new Date().toISOString()
            });
            
            return decoded;
        } catch (error) {
            await this.errorHandler.handleError(error, 'auth');
            throw error;
        }
    }

    setupCleanup() {
        setInterval(() => {
            this.tokenManager.cleanupExpiredTokens(this.tokenBlacklist);
        }, 3600000); // Clean up every hour
    }

    async generateToken(user, options = {}) {
        try {
            const token = jwt.sign(
                {
                    sub: user.id,
                    username: user.username,
                    type: options.type || 'access',
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + (options.expiresIn || 3600)
                },
                process.env.JWT_SECRET
            );

            logger.info('Token generated', {
                user: user.id,
                tokenType: options.type || 'access',
                timestamp: new Date().toISOString()
            });

            return token;
        } catch (error) {
            await this.errorHandler.handleError(error, 'auth');
            throw error;
        }
    }

    async revokeToken(token) {
        try {
            const decoded = jwt.decode(token);
            if (decoded) {
                this.tokenBlacklist.add(token);
                logger.info('Token revoked', {
                    user: decoded.sub,
                    tokenType: decoded.type,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            await this.errorHandler.handleError(error, 'auth');
            throw error;
        }
    }
}

module.exports = EnhancedAuth;