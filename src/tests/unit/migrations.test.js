const mongoose = require('mongoose');
const { runMigrations } = require('../../database/migrations');
const logger = require('../../utils/logger');

jest.mock('mongoose');
jest.mock('../../utils/logger');

describe('Database Migrations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should run migrations successfully', async () => {
        const User = { updateMany: jest.fn().mockResolvedValue({}) };
        mongoose.model.mockReturnValue(User);

        await runMigrations();
        expect(User.updateMany).toHaveBeenCalledWith({}, { $set: { isActive: true } });
        expect(logger.info).toHaveBeenCalledWith('Migrations completed successfully.');
    });

    test('Should handle migration errors', async () => {
        const User = { updateMany: jest.fn().mockRejectedValue(new Error('Test error')) };
        mongoose.model.mockReturnValue(User);

        await expect(runMigrations()).rejects.toThrow('Test error');
        expect(logger.info).not.toHaveBeenCalledWith('Migrations completed successfully.');
    });
});
