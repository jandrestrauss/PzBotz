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
