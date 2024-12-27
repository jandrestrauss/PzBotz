const serviceIntegrator = require('../../src/core/serviceIntegrator');
const metricVisualizer = require('../../src/visualization/metricVisualizer');
const alertNotifier = require('../../src/services/alertNotifier');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/web/app');
const database = require('../../src/database');
const { createTestUser, cleanupTestData } = require('../testUtils');
const promClient = require('prom-client');

describe('Service Integration', () => {
    beforeEach(async () => {
        await serviceIntegrator.start();
    });

    describe('Metrics and Alerts', () => {
        it('should collect and visualize metrics', async () => {
            const metrics = await serviceIntegrator.getService('metrics').getMetrics();
            const chart = await metricVisualizer.generatePerformanceChart(metrics);
            expect(chart).to.be.ok;
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

    afterEach(async () => {
        await serviceIntegrator.stop();
    });
});

describe('Integration Tests', () => {
    beforeEach(async () => {
        await database.sync({ force: true });
        await createTestUser();
    });

    afterEach(async () => {
        await cleanupTestData();
    });

    // Server Management Tests
    describe('Server Management', () => {
        it('should handle server start request', async () => {
            const response = await request(app)
                .post('/api/server/start')
                .expect(200);
            expect(response.body).to.have.property('status', 'success');
        });

        it('should handle server stop request', async () => {
            const response = await request(app)
                .post('/api/server/stop')
                .expect(200);
            expect(response.body).to.have.property('status', 'success');
        });
    });

    // Discord Integration Tests
    describe('Discord Integration', () => {
        it('should generate valid link codes', async () => {
            const response = await request(app)
                .post('/api/discord/link')
                .send({ discordId: '123456789' })
                .expect(200);
            expect(response.body).to.have.property('linkCode');
            expect(response.body.linkCode).to.match(/^[A-F0-9]{6}$/);
        });
    });

    // Error Handling Tests
    describe('Error Handling', () => {
        it('should handle invalid endpoints gracefully', async () => {
            await request(app)
                .get('/api/nonexistent')
                .expect(404);
        });

        it('should handle invalid player IDs', async () => {
            await request(app)
                .get('/api/players/invalid-id/stats')
                .expect(400);
        });
    });
});
