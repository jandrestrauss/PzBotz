const serviceIntegrator = require('../../src/core/serviceIntegrator');
const metricVisualizer = require('../../src/visualization/metricVisualizer');
const alertNotifier = require('../../src/services/alertNotifier');

describe('Service Integration', () => {
    beforeAll(async () => {
        await serviceIntegrator.start();
    });

    describe('Metrics and Alerts', () => {
        it('should collect and visualize metrics', async () => {
            const metrics = await serviceIntegrator.getService('metrics').getMetrics();
            const chart = await metricVisualizer.generatePerformanceChart(metrics);
            expect(chart).toBeTruthy();
        });

        it('should trigger alerts on threshold breach', async () => {
            const alertHandler = jest.fn();
            alertNotifier.on('alert', alertHandler);

            await serviceIntegrator.getService('metrics').simulateHighLoad();
            
            expect(alertHandler).toHaveBeenCalledWith(
                expect.objectContaining({
                    severity: 'warning',
                    metric: 'cpu'
                })
            );
        });
    });

    afterAll(async () => {
        await serviceIntegrator.stop();
    });
});
