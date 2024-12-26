const { describe, test, expect, jest } = require('@jest/globals');
const logger = require('../../utils/logger');

describe('Logger', () => {
    const originalConsoleLog = console.log;
    let consoleOutput = [];

    beforeEach(() => {
        consoleOutput = [];
        console.log = jest.fn((...args) => {
            consoleOutput.push(args.join(' '));
        });
    });

    afterEach(() => {
        console.log = originalConsoleLog;
    });

    test('should log messages with correct format', () => {
        const testMessage = 'Test log message';
        logger.info(testMessage);
        
        expect(consoleOutput[0]).toMatch(/\[\d{4}-\d{2}-\d{2}.*\] INFO: Test log message/);
    });

    test('should log errors with stack trace', () => {
        const testError = new Error('Test error');
        logger.error(testError);
        
        expect(consoleOutput[0]).toMatch(/\[\d{4}-\d{2}-\d{2}.*\] ERROR:/);
        expect(consoleOutput[0]).toContain('Test error');
    });
});
