import { jest } from '@jest/globals';
import * as os from 'os';
import { MetricCollector } from '../../src/services/metricCollector';

jest.mock('os', () => ({
    loadavg: jest.fn(),
    freemem: jest.fn(),
    totalmem: jest.fn(),
    uptime: jest.fn()
}));

describe('MetricCollector', () => {
    let collector: MetricCollector;
    const mockLoadAvg = [1.5, 1.2, 1.0];
    const mockFreeMem = 4000000000;
    const mockTotalMem = 8000000000;
    const mockUptime = 3600;

    beforeEach(() => {
        collector = new MetricCollector();
        (os.loadavg as jest.Mock).mockReturnValue(mockLoadAvg);
        (os.freemem as jest.Mock).mockReturnValue(mockFreeMem);
        (os.totalmem as jest.Mock).mockReturnValue(mockTotalMem);
        (os.uptime as jest.Mock).mockReturnValue(mockUptime);
    });

    afterEach(() => {
        jest.resetAllMocks();
        collector.removeAllListeners();
    });

    test('should collect system metrics', () => {
        const metrics = collector.collectMetrics();

        expect(metrics).toEqual({
            cpuLoad: mockLoadAvg[0],
            memoryUsage: 50, // (1 - 4GB/8GB) * 100
            uptime: mockUptime
        });
    });

    test('should emit metrics collected event', (done) => {
        collector.on('metricsCollected', (metrics) => {
            expect(metrics).toEqual({
                cpuLoad: mockLoadAvg[0],
                memoryUsage: 50,
                uptime: mockUptime
            });
            done();
        });

        collector.collectMetrics();
    });

    test('should handle zero total memory', () => {
        (os.totalmem as jest.Mock).mockReturnValue(0);
        const metrics = collector.collectMetrics();
        expect(metrics.memoryUsage).toBe(0);
    });

    test('should handle negative load average', () => {
        (os.loadavg as jest.Mock).mockReturnValue([-1, 0, 0]);
        const metrics = collector.collectMetrics();
        expect(metrics.cpuLoad).toBe(0);
    });

    test('should allow multiple event listeners', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        collector.on('metricsCollected', listener1);
        collector.on('metricsCollected', listener2);

        collector.collectMetrics();

        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(1);
    });

    test('should provide consistent metrics to all listeners', () => {
        const metrics: any[] = [];
        const listener1 = (m: any) => metrics.push(m);
        const listener2 = (m: any) => metrics.push(m);

        collector.on('metricsCollected', listener1);
        collector.on('metricsCollected', listener2);

        collector.collectMetrics();

        expect(metrics[0]).toEqual(metrics[1]);
    });
});
