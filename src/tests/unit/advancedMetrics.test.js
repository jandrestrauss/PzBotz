const os = require('os');
const AdvancedMetrics = require('../../monitoring/advancedMetrics');
const logger = require('../../utils/logger');

jest.mock('os');
jest.mock('../../utils/logger');

describe('AdvancedMetrics', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should collect CPU usage', () => {
        os.loadavg.mockReturnValue([0.5]);
        const metrics = new AdvancedMetrics();
        const cpuUsage = metrics.getCPUUsage();
        expect(cpuUsage).toBe(50);
    });

    test('Should collect memory usage', () => {
        os.totalmem.mockReturnValue(100);
        os.freemem.mockReturnValue(40);
        const metrics = new AdvancedMetrics();
        const memoryUsage = metrics.getMemoryUsage();
        expect(memoryUsage).toBe(60);
    });

    test('Should alert admin on high CPU usage', () => {
        os.loadavg.mockReturnValue([1.0]);
        const metrics = new AdvancedMetrics();
        metrics.startMonitoring();
        expect(logger.warn).toHaveBeenCalledWith('High CPU usage detected');
    });
});
