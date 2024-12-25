const serviceIntegrator = require('../../src/core/serviceIntegrator');
const metricCollector = require('../../src/services/metrics/metricCollector');
const alertManager = require('../../src/services/alerts/alertManager');

describe('Service Integration Tests', () => {
    beforeAll(async () => {
        await serviceIntegrator.initializeServices();
    });

    test('metrics collection', async () => {
        const metrics = await metricCollector.collectMetrics();
        expect(metrics).toHaveProperty('cpu');
        expect(metrics).toHaveProperty('memory');
    });

    test('service communication', (done) => {
        serviceIntegrator.getService('alerts').once('alert', (alert) => {
            expect(alert).toHaveProperty('severity');
            expect(alert).toHaveProperty('message');
            done();
        });

        metricCollector.emit('threshold-exceeded', {
            metric: 'cpu',
            value: 95
        });
    });

    afterAll(async () => {
        await serviceIntegrator.stop();
    });
});
