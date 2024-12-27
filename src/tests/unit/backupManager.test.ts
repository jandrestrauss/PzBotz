import { jest } from '@jest/globals';
import { BackupManager } from '../../services/backupManager';
import * as logger from '../../utils/logger';
import * as fs from 'fs/promises';
import * as path from 'path';

// Add type definitions for mocks
type MockFs = {
    writeFile: jest.Mock;
    readFile: jest.Mock;
    unlink: jest.Mock;
};

jest.mock('fs/promises');
jest.mock('../../utils/logger', () => ({
    logEvent: jest.fn().mockImplementation(() => {}),
    error: jest.fn().mockImplementation(() => {}),
    info: jest.fn().mockImplementation(() => {})
}));

describe('BackupManager', () => {
    let backupManager: BackupManager;
    const mockBackupPath = '/test/backup/path';

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Type-safe mock implementations
        (fs.writeFile as jest.MockedFunction<typeof fs.writeFile>).mockResolvedValue(undefined);
        (fs.unlink as jest.MockedFunction<typeof fs.unlink>).mockResolvedValue(undefined);
        (fs.readFile as jest.MockedFunction<typeof fs.readFile>).mockResolvedValue(Buffer.from(''));
        (logger.logEvent as jest.MockedFunction<typeof logger.logEvent>).mockImplementation(() => {});
        
        backupManager = new BackupManager(mockBackupPath);
    });

    test('constructor should throw if no backup path provided', () => {
        expect(() => new BackupManager('')).toThrow('Backup path must be provided');
    });

    test('Should create a backup successfully', async () => {
        const backupFile = await backupManager.createBackup();
        
        expect(fs.writeFile).toHaveBeenCalledWith(
            expect.stringContaining(path.normalize(mockBackupPath)),
            expect.any(String)
        );
        expect(backupFile).toContain(path.normalize(mockBackupPath));
        expect(logger.logEvent).toHaveBeenCalledWith('Backup created');
    });

    test('Should handle backup creation errors', async () => {
        const testError = new Error('Test error');
        (fs.writeFile as jest.MockedFunction<typeof fs.writeFile)).mockRejectedValueOnce(testError);

        await expect(backupManager.createBackup()).rejects.toThrow('Test error');
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Backup creation failed'));
    });

    test('Should restore a backup successfully', async () => {
        (fs.readFile as jest.MockedFunction<typeof fs.readFile)).mockResolvedValue(Buffer.from('backup data'));
        const backupFile = 'test-backup.zip';

        await backupManager.restoreBackup(backupFile);

        expect(fs.readFile).toHaveBeenCalledWith(path.join(mockBackupPath, backupFile));
        expect(logger.logEvent).toHaveBeenCalledWith('Backup restored');
    });

    test('Should handle backup restoration errors', async () => {
        const testError = new Error('Test error');
        (fs.readFile as jest.MockedFunction<typeof fs.readFile)).mockRejectedValue(testError);

        await expect(backupManager.restoreBackup('test-backup.zip')).rejects.toThrow('Test error');
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Backup restoration failed'));
    });

    test('Should delete a backup successfully', async () => {
        (fs.unlink as jest.MockedFunction<typeof fs.unlink)).mockResolvedValue(undefined);
        const backupFile = 'test-backup.zip';

        await backupManager.deleteBackup(backupFile);

        expect(fs.unlink).toHaveBeenCalledWith(path.join(mockBackupPath, backupFile));
        expect(logger.info).toHaveBeenCalledWith('Backup deleted: \\\\test\\\\backup\\\\path\\\\test-backup.zip');
    });

    test('Should handle backup deletion errors', async () => {
        const testError = new Error('Test error');
        (fs.unlink as jest.MockedFunction<typeof fs.unlink)).mockRejectedValue(testError);

        await expect(backupManager.deleteBackup('test-backup.zip')).rejects.toThrow('Test error');
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Backup deletion failed'));
    });
});
