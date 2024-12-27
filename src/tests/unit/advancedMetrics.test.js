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

    test('should collect system metrics', async () => {
        os.cpus.mockReturnValue([{ model: 'Intel', speed: 2400 }]);
        os.totalmem.mockReturnValue(8 * 1024 * 1024 * 1024);
        os.freemem.mockReturnValue(4 * 1024 * 1024 * 1024);

        const metrics = await AdvancedMetrics.collect();
        expect(metrics).toHaveProperty('cpu');
        expect(metrics).toHaveProperty('memory');
    });

    test('should handle errors during metric collection', async () => {
        os.cpus.mockImplementation(() => { throw new Error('Test error'); });

        await expect(AdvancedMetrics.collect()).rejects.toThrow('Test error');
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to collect metrics'));
    });
});
