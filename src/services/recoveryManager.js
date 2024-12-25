const logger = require('../utils/logger');
const config = require('../config/config');
const fs = require('fs').promises;
const path = require('path');

class RecoveryManager {
    constructor() {
        this.recoveryConfig = config.get('recovery');
        this.recoveryAttempts = new Map();
        this.backupPath = path.join(process.cwd(), 'recovery');
    }

    async handleFailure(service, error) {
        const attempts = this.recoveryAttempts.get(service) || 0;
        
        if (attempts >= this.recoveryConfig.maxAttempts) {
            await this.escalateFailure(service, error);
            return false;
        }

        try {
            await this.createRecoveryPoint(service);
            await this.executeRecoveryStrategy(service);
            this.recoveryAttempts.set(service, attempts + 1);
            return true;
        } catch (recoveryError) {
            logger.error(`Recovery failed for ${service}:`, recoveryError);
            await this.escalateFailure(service, recoveryError);
            return false;
        }
    }

    async createRecoveryPoint(service) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const recoveryDir = path.join(this.backupPath, service, timestamp);
        
        await fs.mkdir(recoveryDir, { recursive: true });
        await this.backupServiceData(service, recoveryDir);
        
        return recoveryDir;
    }

    async executeRecoveryStrategy(service) {
        const strategy = this.getRecoveryStrategy(service);
        await strategy();
        
        const backoffTime = this.calculateBackoff(service);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
    }

    calculateBackoff(service) {
        const attempts = this.recoveryAttempts.get(service) || 0;
        return Math.min(
            this.recoveryConfig.backoff.initial * Math.pow(this.recoveryConfig.backoff.factor, attempts),
            this.recoveryConfig.backoff.max
        );
    }
}

module.exports = new RecoveryManager();
