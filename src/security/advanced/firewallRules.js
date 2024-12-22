const rateLimit = require('express-rate-limit');
const metrics = require('../../monitoring/advancedMetrics');

class FirewallRules {
    constructor() {
        this.blockedIPs = new Set();
        this.suspiciousActivity = new Map();
        this.setupCleanup();
    }

    validateRequest(req) {
        const clientIP = req.ip;
        
        if (this.isBlocked(clientIP)) {
            metrics.metrics.security.set('blocked_requests', 
                (metrics.metrics.security.get('blocked_requests') || 0) + 1
            );
            throw new Error('IP is blocked');
        }

        this.trackRequest(clientIP);
    }

    isBlocked(ip) {
        return this.blockedIPs.has(ip);
    }

    setupCleanup() {
        setInterval(() => {
            const hour = 60 * 60 * 1000;
            const now = Date.now();
            
            for (const [ip, lastActivity] of this.suspiciousActivity) {
                if (now - lastActivity > hour) {
                    this.suspiciousActivity.delete(ip);
                }
            }
        }, 3600000); // Clean up every hour
    }
}

module.exports = new FirewallRules();
