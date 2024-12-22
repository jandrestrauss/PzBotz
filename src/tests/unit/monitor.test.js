const { monitorAdvancedMetrics } = require('../../monitoring/monitor');
const logger = require('../../utils/logger');

jest.mock('../../utils/logger');

describe('Monitoring System', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should monitor advanced metrics', async () => {
        const getCPUUsage = jest.fn().mockResolvedValue(85);
        const getMemoryUsage = jest.fn().mockResolvedValue(70);
        const getDiskIO = jest.fn().mockResolvedValue(50);

        await monitorAdvancedMetrics();
        expect(getCPUUsage).toHaveBeenCalled();
        expect(getMemoryUsage).toHaveBeenCalled();
        expect(getDiskIO).toHaveBeenCalled();
        expect(logger.warn).toHaveBeenCalledWith('High CPU usage detected');
    });

    test('Should handle monitoring errors', async () => {
        const getCPUUsage = jest.fn().mockRejectedValue(new Error('Test error'));

        await expect(monitorAdvancedMetrics()).rejects.toThrow('Test error');
        expect(logger.warn).not.toHaveBeenCalledWith('High CPU usage detected');
    });
});
