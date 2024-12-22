const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/web/app');
const database = require('../src/database');
const { createTestUser, cleanupTestData } = require('./testUtils');

describe('Integration Tests', () => {
    before(async () => {
        await database.sync({ force: true });
        await createTestUser();
    });

    after(async () => {
        await cleanupTestData();
    });

    describe('API Endpoints', () => {
        it('should return server status', async () => {
            const response = await request(app)
                .get('/api/status')
                .expect(200);
            expect(response.body).to.have.property('playerCount');
        });

        it('should handle player stats request', async () => {
            const response = await request(app)
                .get('/api/players/test-id/stats')
                .expect(200);
            expect(response.body).to.have.property('playtime');
        });
    });
});
