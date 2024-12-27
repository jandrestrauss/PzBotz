import { metrics as advancedMetrics } from '../../monitoring/advancedMetrics';
import * as logger from '../../utils/logger';
import os from 'os';

type CpuInfo = {
    model: string;
    speed: number;
    times: {
        user: number;
        nice: number;
        sys: number;
        idle: number;
        irq: number;
    };
};

// Mock the necessary functions
jest.mock('../../monitoring/advancedMetrics', () => ({
    resetAll: jest.fn(),
    getMetrics: jest.fn().mockReturnValue({ queryCount: 0, errorRate: 0, avgQueryTime: 0 }),
    recordQuery: jest.fn(),
    // ...other methods...
}));

jest.mock('../../utils/logger', () => ({
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn()
}));

describe('Advanced Metrics', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should collect CPU metrics', () => {
        const mockCpuInfo: CpuInfo[] = [
            // ...mock data...
        ];
        jest.spyOn(os, 'cpus').mockReturnValue(mockCpuInfo);
        jest.spyOn(os, 'totalmem').mockReturnValue(16000000000);
        jest.spyOn(os, 'freemem').mockReturnValue(8000000000);

        // Simulate metrics collection
        advancedMetrics.recordQuery(100, true);

        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('CPU metrics collected'));
    });

    test('should handle errors during metrics collection', () => {
        jest.spyOn(os, 'cpus').mockImplementation(() => {
            throw new Error('Test error');
        });

        // Simulate metrics collection
        advancedMetrics.recordQuery(100, false);

        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error collecting metrics'));
    });

    test('should log system metrics', () => {
        const cpuUsage = os.loadavg();
        const memoryUsage = os.totalmem() - os.freemem();
        const uptime = os.uptime();

        // Simulate metrics collection
        advancedMetrics.recordQuery(200, true);

        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('System metrics logged'));
    });

    test('should reset metrics', () => {
        advancedMetrics.resetAll();

        expect(advancedMetrics.resetAll).toHaveBeenCalled();
        expect(advancedMetrics.getMetrics()).toEqual({ queryCount: 0, errorRate: 0 });
    });

    test('should calculate average query time correctly', () => {
        advancedMetrics.recordQuery(100, true);
        advancedMetrics.recordQuery(200, true);

        const metrics = advancedMetrics.getMetrics();
        expect(metrics.avgQueryTime).toBe(150);
    });

    test('should calculate error rate correctly', () => {
        advancedMetrics.recordQuery(100, true);
        advancedMetrics.recordQuery(100, false);

        const metrics = advancedMetrics.getMetrics();
        expect(metrics.errorRate).toBe(50);
    });
});
        jest.spyOn(os, 'freemem').mockReturnValue(8000000000);

        // Simulate metrics collection
        advancedMetrics.recordQuery(100, true);

        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('CPU metrics collected'));
    });

    test('should handle errors during metrics collection', () => {
        jest.spyOn(os, 'cpus').mockImplementation(() => {
            throw new Error('Test error');
        });

        // Simulate metrics collection
        advancedMetrics.recordQuery(100, false);

        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error collecting metrics'));
    });

    test('should log system metrics', () => {
        const cpuUsage = os.loadavg();
        const memoryUsage = os.totalmem() - os.freemem();
        const uptime = os.uptime();

        // ...existing code...
    });
});
