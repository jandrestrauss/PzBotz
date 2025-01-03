const request = require('supertest');
const app = require('../../App');
const ZomboidServer = require('../../zomboid/server');
const { generateToken } = require('../../auth/authHandler');

describe('API Integration Tests', () => {
    let authToken;

    beforeAll(async () => {
        authToken = await generateToken({ id: 'test', role: 'admin' });
    });

    describe('Server Controls', () => {
        test('Should start server successfully', async () => {
            const response = await request(app)
                .post('/api/server/start')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.status).toBe('starting');
        });

        test('Should handle server errors appropriately', async () => {
            // Mock server error
            jest.spyOn(ZomboidServer, 'start').mockRejectedValue(new Error('Test error'));

            const response = await request(app)
                .post('/api/server/start')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(500);

            expect(response.body.error).toBeDefined();
        });
    });
});
