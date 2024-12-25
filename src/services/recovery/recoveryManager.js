const fs = require('fs').promises;
const path = require('path');
const logger = require('../../utils/logger');

class RecoveryManager {
    constructor() {
        this.recoveryStrategies = new Map([
            ['serverCrash', this.handleServerCrash],
            ['backupFailure', this.handleBackupFailure],
            ['databaseError', this.handleDatabaseError]
        ]);
    }

    async recover(error) {
        const strategy = this.recoveryStrategies.get(error.type);
        if (!strategy) {
            logger.error('No recovery strategy for error type:', error.type);
            return false;
        }

        try {
            await strategy.call(this, error);
            return true;
        } catch (recoveryError) {
            logger.error('Recovery failed:', recoveryError);
            return false;
        }
    }

    async createRecoveryPoint() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const recoveryPath = path.join(process.cwd(), 'recovery', timestamp);

        await fs.mkdir(recoveryPath, { recursive: true });
        await this.backupConfiguration(recoveryPath);
        await this.backupData(recoveryPath);

        return recoveryPath;
    }

    async restoreFromPoint(pointPath) {
        if (!await fs.access(pointPath).then(() => true).catch(() => false)) {
            throw new Error('Recovery point not found');
        }

        await this.restoreConfiguration(pointPath);
        await this.restoreData(pointPath);
    }
}

module.exports = new RecoveryManager();
