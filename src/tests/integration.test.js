const request = require('supertest');
const app = require('../app');
const { AppError } = require('../utils/errorHandler');

describe('API Integration Tests', () => {
    test('GET /api/status should return server status', async () => {
        const response = await request(app)
            .get('/api/status')
            .expect(200);
        
        expect(response.body).toHaveProperty('status');
    });

    test('POST /api/server/control requires authentication', async () => {
        await request(app)
            .post('/api/server/control')
            .send({ action: 'restart' })
            .expect(403);
    });

    test('GET /api/metrics requires proper permissions', async () => {
        await request(app)
            .get('/api/metrics')
            .expect(403);
    });
});
