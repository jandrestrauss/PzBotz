import { jest } from '@jest/globals';
import { MetricCollector } from '../../src/services/metricCollector';
import * as logger from '../../src/utils/logger';

jest.mock('../../src/utils/logger');

describe('Service Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (logger.error as jest.Mock) = jest.fn();
        (logger.info as jest.Mock) = jest.fn();
        (logger.logEvent as jest.Mock) = jest.fn();
    });

    test('metrics collection', async () => {
        const collector = new MetricCollector();
        const metrics = collector.collectMetrics();

        expect(metrics).toBeDefined();
        expect(metrics.cpuLoad).toBeDefined();
        expect(metrics.memoryUsage).toBeDefined();
        expect(logger.error).not.toHaveBeenCalled();
    });

    test('service communication', () => {
        const collector = new MetricCollector();
        const mockCallback = jest.fn();
        
        collector.on('metricsCollected', mockCallback);
        collector.collectMetrics();

        expect(mockCallback).toHaveBeenCalled();
        expect(logger.error).not.toHaveBeenCalled();
    });
});
