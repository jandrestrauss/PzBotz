const fs = require('fs');
const path = require('path');
const BackupManager = require('../../backup/backupManager');
const logger = require('../../utils/logger');

jest.mock('fs');
jest.mock('../../utils/logger', () => ({
    logEvent: jest.fn(),
    error: jest.fn()
}));

describe('BackupManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should create a backup successfully', async () => {
        const backupFile = await BackupManager.createBackup();
        expect(backupFile).toMatch(/backup_\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.zip/);
        expect(logger.logEvent).toHaveBeenCalledWith(expect.stringContaining('Backup created'));
    });

    test('Should handle backup creation errors', async () => {
        fs.writeFile.mockRejectedValue(new Error('Test error'));
        await expect(BackupManager.createBackup()).rejects.toThrow('Test error');
        expect(logger.logEvent).toHaveBeenCalledWith(expect.stringContaining('Backup creation failed'));
    });

    test('Should restore a backup successfully', async () => {
        await BackupManager.restoreBackup('backup_test.zip');
        expect(logger.logEvent).toHaveBeenCalledWith(expect.stringContaining('Backup restored'));
    });

    test('Should handle backup restoration errors', async () => {
        fs.readFile.mockRejectedValue(new Error('Test error'));
        await expect(BackupManager.restoreBackup('backup_test.zip')).rejects.toThrow('Test error');
        expect(logger.logEvent).toHaveBeenCalledWith(expect.stringContaining('Backup restoration failed'));
    });

    test('Should delete a backup successfully', async () => {
        await BackupManager.deleteBackup('backup_test.zip');
        expect(logger.logEvent).toHaveBeenCalledWith(expect.stringContaining('Backup deleted'));
    });

    test('Should handle backup deletion errors', async () => {
        fs.unlink.mockRejectedValue(new Error('Test error'));
        await expect(BackupManager.deleteBackup('backup_test.zip')).rejects.toThrow('Test error');
        expect(logger.logEvent).toHaveBeenCalledWith(expect.stringContaining('Backup deletion failed'));
    });
});
