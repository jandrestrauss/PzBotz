import { jest } from '@jest/globals';
import { BackupManager } from '../../services/backupManager';
import * as logger from '../../utils/logger';
import * as fs from 'fs/promises';
import * as path from 'path';

// Mock fs and logger
jest.mock('fs/promises');
jest.mock('../../utils/logger');

describe('BackupManager', () => {
    let backupManager: BackupManager;
    const mockBackupPath = '/test/backup/path';

    beforeEach(() => {
        jest.clearAllMocks();
        backupManager = new BackupManager(mockBackupPath);
        // Type-safe mock of logger
        (logger.logEvent as jest.Mock) = jest.fn();

        // Setup fs mock implementations
        (fs.writeFile as jest.Mock).mockImplementation(() => Promise.resolve());
        (fs.readFile as jest.Mock).mockImplementation(() => Promise.resolve(Buffer.from('')));
        (fs.unlink as jest.Mock).mockImplementation(() => Promise.resolve());
    });

    test('constructor should throw if no backup path provided', () => {
        expect(() => new BackupManager('')).toThrow('Backup path must be provided');
    });

    test('Should create a backup successfully', async () => {
            jest.spyOn(logger, 'logEvent'); // Add this line to spy on the logEvent function
    
            const backupFile = await backupManager.createBackup();
            
            expect(fs.writeFile).toHaveBeenCalledWith(
                expect.stringContaining(mockBackupPath),
                expect.any(String)
            );
            expect(backupFile).toContain(mockBackupPath);
            expect(logger.logEvent).toHaveBeenCalledWith(expect.stringContaining('Backup created'));
    });

    test('Should handle backup creation errors', async () => {
        const testError = new Error('Test error');
        (fs.writeFile as jest.Mock).mockRejectedValueOnce(testError);

        await expect(backupManager.createBackup()).rejects.toThrow('Test error');
        expect(logger.logEvent).toHaveBeenCalledWith(expect.stringContaining('Backup creation failed'));
    });

    test('Should restore a backup successfully', async () => {
        (fs.readFile as jest.Mock<Promise<Buffer>>).mockResolvedValue(Buffer.from('backup data'));
        const backupFile = 'test-backup.zip';

        await backupManager.restoreBackup(backupFile);

        expect(fs.readFile).toHaveBeenCalledWith(path.join(mockBackupPath, backupFile));
        expect(logger.logEvent).toHaveBeenCalledWith(expect.stringContaining('Backup restored'));
    });

    test('Should handle backup restoration errors', async () => {
        const testError = new Error('Test error');
        (fs.readFile as jest.Mock).mockRejectedValue(testError);

        await expect(backupManager.restoreBackup('test-backup.zip')).rejects.toThrow('Test error');
        expect(logger.logEvent).toHaveBeenCalledWith(expect.stringContaining('Backup restoration failed'));
    });

    test('Should delete a backup successfully', async () => {
        (fs.unlink as jest.Mock<Promise<void>>).mockResolvedValue();
        const backupFile = 'test-backup.zip';

        await backupManager.deleteBackup(backupFile);

        expect(fs.unlink).toHaveBeenCalledWith(path.join(mockBackupPath, backupFile));
        expect(logger.logEvent).toHaveBeenCalledWith(expect.stringContaining('Backup deleted'));
    });

    test('Should handle backup deletion errors', async () => {
        const testError = new Error('Test error');
        (fs.unlink as jest.Mock<Promise<void>>).mockRejectedValue(testError);

        await expect(backupManager.deleteBackup('test-backup.zip')).rejects.toThrow('Test error');
        expect(logger.logEvent).toHaveBeenCalledWith(expect.stringContaining('Backup deletion failed'));
    });
});
