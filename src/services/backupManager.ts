import * as fs from 'fs/promises';
import * as path from 'path';
import * as logger from '../utils/logger';

export class BackupManager {
    private backupPath: string;

    constructor(backupPath: string) {
        if (backupPath === '') {
            throw new Error('Backup path must be provided');
        }
        this.backupPath = backupPath;
    }

    async createBackup(): Promise<string> {
        const backupFile = path.join(this.backupPath, `backup-${Date.now()}.zip`);
        try {
            await fs.writeFile(backupFile, 'backup data');
            logger.logEvent('Backup created');
            return backupFile;
        } catch (error) {
            logger.error(`Backup creation failed: ${(error as Error).message}, Path: ${backupFile}`);
            throw error;
        }
    }

    async restoreBackup(backupFile: string): Promise<void> {
        const data = await fs.readFile(path.join(this.backupPath, backupFile));
        // Simulate restoring backup with the data
        logger.logEvent('Backup restored');
    }

    async deleteBackup(backupFile: string): Promise<void> {
        const filePath = path.join(this.backupPath, backupFile);
        try {
            await fs.unlink(filePath);
            logger.logEvent(`Backup deleted: ${filePath}`);
        } catch (error) {
            logger.logEvent(`Backup deletion failed: ${(error as Error).message}`);
            throw error;
        }
    }
}
