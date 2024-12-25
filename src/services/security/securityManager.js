const crypto = require('crypto');
const logger = require('../../utils/logger');

class SecurityManager {
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
}

module.exports = new SecurityManager();
