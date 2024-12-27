import * as fs from 'fs/promises';
// ...existing code...

jest.mock('fs/promises');

describe('BackupManager', () => {
    const testError = new Error('Test error');
    
    beforeEach(() => {
        jest.clearAllMocks();
        (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
        (fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('backup data'));
        (fs.unlink as jest.Mock).mockResolvedValue(undefined);
    });

    // ...existing code...

    describe('createBackup', () => {
        test('should handle write errors', async () => {
            (fs.writeFile as jest.Mock).mockRejectedValueOnce(testError);
            // ...existing code...
        });
    });

    describe('restoreBackup', () => {
        test('should handle read errors', async () => {
            (fs.readFile as jest.Mock).mockRejectedValueOnce(testError);
            // ...existing code...
        });
    });

    describe('deleteBackup', () => {
        test('should handle delete errors', async () => {
            (fs.unlink as jest.Mock).mockRejectedValueOnce(testError);
            // ...existing code...
        });
    });
});
