const crypto = require('crypto');
const logger = require('../utils/logger');

class AdvancedSecurity {
    constructor() {
        this.failedAttempts = new Map();
        this.blockedIPs = new Set();
        this.algorithm = 'aes-256-gcm';
        this.tokenRotationInterval = 30 * 24 * 60 * 60 * 1000; // 30 days
    }

    async validateRequest(request, token) {
        if (this.isIPBlocked(request.ip)) {
            throw new Error('IP is blocked');
        }

        if (!await this.validateToken(token)) {
            this.recordFailedAttempt(request.ip);
            throw new Error('Invalid token');
        }

        this.clearFailedAttempts(request.ip);
    }

    recordFailedAttempt(ip) {
        const attempts = (this.failedAttempts.get(ip) || 0) + 1;
        this.failedAttempts.set(ip, attempts);

        if (attempts >= 5) {
            this.blockIP(ip);
        }
    }

    blockIP(ip) {
        this.blockedIPs.add(ip);
        logger.warn(`IP blocked due to multiple failed attempts: ${ip}`);
        setTimeout(() => this.unblockIP(ip), 3600000); // 1 hour
    }

    unblockIP(ip) {
        this.blockedIPs.delete(ip);
        this.failedAttempts.delete(ip);
    }

    isIPBlocked(ip) {
        return this.blockedIPs.has(ip);
    }

    encryptToken(token) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.getKey(), iv);
        const encrypted = Buffer.concat([cipher.update(token), cipher.final()]);
        return { 
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')
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

    getKey() {
        return crypto.scryptSync(process.env.TOKEN_SECRET, 'salt', 32);
    }

    async rotateTokens() {
        const newSecret = crypto.randomBytes(32).toString('hex');
        process.env.TOKEN_SECRET = newSecret;
        logger.info('Token secret rotated successfully');
    }

    async auditLog(event, details) {
        const logEntry = {
            event,
            details,
            timestamp: new Date().toISOString()
        };
        // Save logEntry to a secure location
        logger.info('Audit log entry:', logEntry);
    }
}

module.exports = new AdvancedSecurity();
