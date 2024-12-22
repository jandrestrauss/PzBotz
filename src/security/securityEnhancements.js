const crypto = require('crypto');
const { AppError } = require('../utils/errorHandler');

class SecurityManager {
    constructor() {
        this.blockedIPs = new Set();
        this.suspiciousActivity = new Map();
        this.setupSecurityChecks();
    }

    setupSecurityChecks() {
        setInterval(() => this.cleanupOldEntries(), 3600000);
    }

    validateRequest(req) {
        const clientIP = req.ip;
        if (this.blockedIPs.has(clientIP)) {
            throw new AppError('Access denied', 403);
        }

        const requestHash = this.generateRequestHash(req);
        this.trackRequest(clientIP, requestHash);
    }

    generateRequestHash(req) {
        return crypto
            .createHash('sha256')
            .update(`${req.method}${req.path}${JSON.stringify(req.body)}`)
            .digest('hex');
    }

    trackRequest(ip, hash) {
        if (!this.suspiciousActivity.has(ip)) {
            this.suspiciousActivity.set(ip, new Map());
        }
        const activity = this.suspiciousActivity.get(ip);
        activity.set(hash, (activity.get(hash) || 0) + 1);

        if (activity.get(hash) > 10) {
            this.blockedIPs.add(ip);
        }
    }
}

module.exports = new SecurityManager();
