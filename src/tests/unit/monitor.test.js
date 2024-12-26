const { describe, test, expect, beforeEach, jest } = require('@jest/globals');
const Monitor = require('../../services/monitor');

describe('Monitor', () => {
    let monitor;
    
    beforeEach(() => {
        monitor = new Monitor();
    });

    test('should track system metrics', async () => {
        const metrics = await monitor.getMetrics();
        expect(metrics).toHaveProperty('memory');
        expect(metrics).toHaveProperty('cpu');
        expect(metrics).toHaveProperty('uptime');
    });

    test('should handle error conditions', async () => {
        monitor.getSystemMetrics = jest.fn().mockRejectedValue(new Error('Test error'));
        
        await expect(monitor.getMetrics()).rejects.toThrow('Test error');
    });
});
