const UnifiedMonitor = require('../monitoring/unifiedMonitor');
const TokenManager = require('../security/tokenManager');
const EnhancedErrorHandler = require('../errorHandling/enhancedErrorHandler');

describe('System Integration Tests', () => {
    let monitor;
    let tokenManager;
    let errorHandler;

    beforeEach(() => {
        monitor = new UnifiedMonitor();
        tokenManager = new TokenManager();
        errorHandler = new EnhancedErrorHandler();
    });

    afterEach(() => {
        monitor.stop();
    });

    describe('System Monitoring', () => {
        test('should detect and handle threshold breaches', async () => {
            const thresholdListener = jest.fn();
            monitor.on('threshold_exceeded', thresholdListener);
            
            await monitor.handleThresholdExceeded('cpu', 95);
            
            expect(thresholdListener).toHaveBeenCalledWith({
                metric: 'cpu',
                value: 95,
                threshold: 90
            });
        });

        test('should collect and aggregate metrics', async () => {
            const metrics = await monitor.collectMetrics();
            
            expect(metrics).toHaveProperty('cpu');
            expect(metrics).toHaveProperty('memory');
            expect(metrics).toHaveProperty('disk');
            expect(metrics).toHaveProperty('network');
        });
    });

    describe('Error Handling', () => {
        test('should properly categorize and handle errors', async () => {
            const error = new Error('Test error');
            await errorHandler.handleError(error, 'auth');
            
            // Verify error was logged with correct category
            expect(error).toHaveProperty('category', 'auth');
        });
    });

    describe('Security', () => {
        test('should properly handle rate limiting', async () => {
            const key = 'test:user:123';
            
            // Should not throw for first attempt
            await expect(tokenManager.checkRateLimit(key)).resolves.toBe(1);
            
            // Simulate rate limit exceeded
            for (let i = 0; i < 100; i++) {
                await tokenManager.checkRateLimit(key);
            }
            
            // Should throw rate limit error
            await expect(tokenManager.checkRateLimit(key)).rejects.toThrow('Rate limit exceeded');
        });
    });
});