const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const logger = require('../utils/logger');

class BackupService {
    constructor() {
        this.backupDir = path.join(process.cwd(), 'backups');
        this.maxBackups = 5;
        this.schedule = null;
    }

    start() {
        // Run backup every 6 hours
        this.schedule = cron.schedule('0 */6 * * *', () => {
            this.createBackup();
        });
        logger.info('Backup service started');
    }

    stop() {
        if (this.schedule) {
            this.schedule.stop();
        }
        logger.info('Backup service stopped');
    }

    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(this.backupDir, `backup-${timestamp}`);

        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }

        try {
            await this.executeBackup(backupPath);
            await this.cleanOldBackups();
            logger.info(`Backup created at ${backupPath}`);
        } catch (error) {
            logger.error('Backup creation failed:', error);
        }
    }

    executeBackup(backupPath) {
        return new Promise((resolve, reject) => {
            exec(`xcopy /E /I /Y "Zomboid" "${backupPath}"`, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }

    async cleanOldBackups() {
        const backups = fs.readdirSync(this.backupDir)
            .filter(file => file.startsWith('backup-'))
            .map(file => ({
                name: file,
                path: path.join(this.backupDir, file),
                time: fs.statSync(path.join(this.backupDir, file)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        while (backups.length > this.maxBackups) {
            const oldBackup = backups.pop();
            fs.rmSync(oldBackup.path, { recursive: true, force: true });
            logger.info(`Removed old backup: ${oldBackup.name}`);
        }
    }
}

module.exports = new BackupService();
