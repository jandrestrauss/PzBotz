const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const logger = require('../src/utils/logger');

async function verifyBackup(backupPath) {
    try {
        // Verify backup file exists
        await fs.access(backupPath);
        
        // Test backup integrity
        await new Promise((resolve, reject) => {
            exec(`7z t "${backupPath}"`, (error, stdout) => {
                if (error) reject(error);
                else resolve(stdout);
            });
        });

        // Verify backup contents
        const expectedFiles = [
            'db.sqlite',
            'server-settings.txt',
            'players/',
            'mods/'
        ];

        for (const file of expectedFiles) {
            const exists = await fileExistsInZip(backupPath, file);
            if (!exists) {
                throw new Error(`Missing required file: ${file}`);
            }
        }

        logger.info(`Backup verified successfully: ${backupPath}`);
        return true;
    } catch (error) {
        logger.error(`Backup verification failed: ${error.message}`);
        return false;
    }
}

module.exports = verifyBackup;
