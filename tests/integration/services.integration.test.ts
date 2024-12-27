import { jest } from '@jest/globals';
import { MetricCollector } from '../../src/services/metricCollector';
import { DatabasePool, DatabasePoolMock } from '../../src/database/pool';
import { metrics } from '../../src/monitoring/advancedMetrics';
import * as logger from '../../src/utils/logger';

jest.mock('../../src/utils/logger');

describe('Service Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        metrics.resetAll();
        (logger.error as jest.Mock) = jest.fn();
        (logger.info as jest.Mock) = jest.fn();
    });

    test('metrics collection with database integration', async () => {
        const collector = new MetricCollector();
        const dbPool = new DatabasePoolMock();
        
        await dbPool.query('SELECT NOW()');
        const systemMetrics = collector.collectMetrics();
        const dbMetrics = dbPool.getMetrics();

        expect(systemMetrics).toBeDefined();
        expect(dbMetrics.queryCount).toBe(1);
        expect(dbMetrics.errorRate).toBe(0);
        expect(logger.error).not.toHaveBeenCalled();
    });

    test('service communication and metrics flow', () => {
        const collector = new MetricCollector();
        const metricsCallback = jest.fn();
        
        collector.on('metricsCollected', metricsCallback);
        collector.collectMetrics();

        expect(metricsCallback).toHaveBeenCalled();
        expect(logger.error).not.toHaveBeenCalled();
    });
});
