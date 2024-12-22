const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const logger = require('./utils/logger');

class BackupSystem {
    constructor() {
        this.backupDir = process.env.BACKUP_DIR || './backups';
        this.maxBackups = 5;
    }

    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(this.backupDir, `backup-${timestamp}`);

        try {
            await fs.mkdir(backupPath, { recursive: true });
            await this.backupGameFiles(backupPath);
            await this.cleanOldBackups();
            logger.info(`Backup created successfully at ${backupPath}`);
        } catch (error) {
            logger.error('Backup failed:', error);
        }
    }

    async backupGameFiles(backupPath) {
        return new Promise((resolve, reject) => {
            exec(`7z a "${backupPath}.zip" "${process.env.GAME_DIR}"`, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }

    async cleanOldBackups() {
        const files = await fs.readdir(this.backupDir);
        if (files.length > this.maxBackups) {
            const sortedFiles = files
                .map(f => ({ name: f, time: fs.stat(path.join(this.backupDir, f)).mtime }))
                .sort((a, b) => b.time - a.time);

            for (let i = this.maxBackups; i < sortedFiles.length; i++) {
                await fs.unlink(path.join(this.backupDir, sortedFiles[i].name));
            }
        }
    }
}

module.exports = new BackupSystem();
