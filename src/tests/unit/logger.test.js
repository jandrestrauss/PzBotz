const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

jest.mock('fs');

describe('Logger', () => {
    const logFile = path.join(__dirname, '../../../logs/app.log');

    beforeEach(() => {
        fs.appendFileSync.mockClear();
    });

    test('Should log events correctly', () => {
        const event = 'Test event';
        logger.logEvent(event);

        expect(fs.appendFileSync).toHaveBeenCalledWith(logFile, expect.stringContaining(event));
    });

    test('Should log errors correctly', () => {
        const message = 'Test error';
        const error = new Error('Test error stack');
        logger.error(message, error);

        expect(fs.appendFileSync).toHaveBeenCalledWith(logFile, expect.stringContaining(message));
        expect(fs.appendFileSync).toHaveBeenCalledWith(logFile, expect.stringContaining(error.stack));
    });
});
