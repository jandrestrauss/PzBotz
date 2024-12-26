const HealthCheck = require('../src/health');
const { STATUS } = require('../src/constants');
const { createMockRcon, createMockDiscord } = require('./utils/testHelpers');

describe('HealthCheck', () => {
    let healthCheck;
    let mockRconHandler;
    let mockDiscordClient;

    beforeEach(() => {
        mockRconHandler = createMockRcon();
        mockDiscordClient = createMockDiscord();
        healthCheck = new HealthCheck(mockRconHandler, mockDiscordClient);
    });

    test('checkDiscord returns healthy status when connection is good', async () => {
        const result = await healthCheck.checkDiscord();
        expect(result.status).toBe(STATUS.HEALTHY);
        expect(result.latency).toBe(42);
    });

    test('checkRcon returns healthy status on successful ping', async () => {
        const result = await healthCheck.checkRcon();
        expect(result.status).toBe(STATUS.HEALTHY);
    });

    test('checkDiscord returns unhealthy status when disconnected', async () => {
        mockDiscordClient.ws.status = 1;
        const result = await healthCheck.checkDiscord();
        expect(result.status).toBe(STATUS.UNHEALTHY);
    });

    test('checkSystem returns memory usage and uptime', async () => {
        const result = await healthCheck.checkSystem();
        expect(result).toHaveProperty('memory');
        expect(result).toHaveProperty('uptime');
        expect(result.status).toBe(STATUS.HEALTHY);
    });

    test('checkRcon returns unhealthy status on failed ping', async () => {
        mockRconHandler.sendCommand.mockRejectedValueOnce(new Error('Connection failed'));
        const result = await healthCheck.checkRcon();
        expect(result.status).toBe(STATUS.UNHEALTHY);
        expect(result.error).toBeTruthy();
    });
});
