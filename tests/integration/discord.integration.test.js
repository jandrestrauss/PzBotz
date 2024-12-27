const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/web/app');
const { createTestUser, cleanupTestData } = require('../testUtils');
const promClient = require('prom-client');

describe('Discord Integration', () => {
    before(async () => {
        await createTestUser();
    });

    after(async () => {
        await cleanupTestData();
    });

    describe('Link Generation', () => {
        it('should generate valid link codes', async () => {
            const response = await request(app)
                .post('/api/discord/link')
                .send({ discordId: '123456789' })
                .expect(200);

            expect(response.body).to.have.property('linkCode');
            expect(response.body.linkCode).to.match(/^[A-F0-9]{6}$/);
        });

        it('should reject invalid Discord IDs', async () => {
            await request(app)
                .post('/api/discord/link')
                .send({ discordId: 'invalid-id' })
                .expect(400);
        });
    });
});
