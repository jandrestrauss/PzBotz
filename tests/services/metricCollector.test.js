const MetricCollector = require('../../src/services/metrics/metricCollector');
const mockOs = require('os');

jest.mock('os');

describe('MetricCollector', () => {
    beforeEach(() => {
        mockOs.loadavg.mockReturnValue([1.5, 1.0, 0.5]);
        mockOs.totalmem.mockReturnValue(8589934592); // 8GB
        mockOs.freemem.mockReturnValue(4294967296); // 4GB
    });

    it('should collect system metrics', async () => {
        const metrics = await MetricCollector.collectSystem();
        expect(metrics.cpu).toBe(1.5);
        expect(metrics.memory.total).toBe(8589934592);
        expect(metrics.memory.used).toBe(4294967296);
    });

    it('should emit metrics collected event', (done) => {
        MetricCollector.once('metricsCollected', ({ type, data }) => {
            expect(type).toBe('system');
            expect(data).toBeDefined();
            done();
        });
        MetricCollector.collect('system');
    });
});
