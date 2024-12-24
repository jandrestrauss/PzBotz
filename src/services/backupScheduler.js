const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const logger = require('../utils/logger');
const archiver = require('archiver');

class BackupScheduler {
    constructor() {
        this.backupDir = path.join(process.cwd(), 'backups');
        this.maxBackups = 5;
        this.schedule = null;
        this.setupDirectory();
    }

    setupDirectory() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }

    start() {
        // Schedule backup every 6 hours
        this.schedule = cron.schedule('0 */6 * * *', () => {
            this.createBackup();
        });
        logger.logEvent('Backup scheduler started');
    }

    stop() {
        if (this.schedule) {
            this.schedule.stop();
        }
    }

    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(this.backupDir, `backup-${timestamp}`);
        const zipPath = `${backupPath}.zip`;

        try {
            await this.saveAndPrepare();
            await this.zipDirectory('Zomboid', zipPath);
            await this.cleanOldBackups();
            logger.logEvent(`Backup created: ${path.basename(zipPath)}`);
            return zipPath;
        } catch (error) {
            logger.error('Backup creation failed:', error);
            throw error;
        }
    }

    async saveAndPrepare() {
        return new Promise((resolve, reject) => {
            exec('save', { cwd: process.cwd() }, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }

    zipDirectory(sourceDir, outPath) {
        return new Promise((resolve, reject) => {
            const archive = archiver('zip', { zlib: { level: 9 }});
            const output = fs.createWriteStream(outPath);

            output.on('close', resolve);
            archive.on('error', reject);

            archive.pipe(output);
            archive.directory(sourceDir, false);
            archive.finalize();
        });
    }

    async cleanOldBackups() {
        const files = fs.readdirSync(this.backupDir)
            .filter(file => file.startsWith('backup-'))
            .map(file => ({
                name: file,
                path: path.join(this.backupDir, file),
                time: fs.statSync(path.join(this.backupDir, file)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        while (files.length > this.maxBackups) {
            const oldFile = files.pop();
            fs.unlinkSync(oldFile.path);
            logger.logEvent(`Removed old backup: ${oldFile.name}`);
        }
    }
}

module.exports = new BackupScheduler();
