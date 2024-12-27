import { jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/web/app';
import { pool } from '../src/database/pool';
import { metrics } from '../src/monitoring/advancedMetrics';

describe('API Integration Tests', () => {
    beforeAll(async () => {
        await pool.query('DROP DATABASE IF EXISTS testdb');
        await pool.query('CREATE DATABASE testdb');
        await pool.query('USE testdb');
        // Additional setup if needed
    });

    afterAll(async () => {
        await pool.end();
    });

    beforeEach(() => {
        metrics.reset();
    });

    describe('Endpoints', () => {
        test('GET /health should return 200', async () => {
            const response = await request(app)
                .get('/health')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('status', 'ok');
        });

        test('GET /metrics should return server metrics', async () => {
            const response = await request(app)
                .get('/metrics')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('system');
            expect(response.body).toHaveProperty('database');
        });

        test('POST /api/backup should create backup', async () => {
            const response = await request(app)
                .post('/api/backup')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Backup created successfully');
        });
    });

    describe('Error Handling', () => {
        test('should handle 404 routes', async () => {
            const response = await request(app)
                .get('/nonexistent')
                .expect('Content-Type', /json/)
                .expect(404);

            expect(response.body).toEqual({ error: 'Route not found' });
        });

        test('should handle invalid requests', async () => {
            const response = await request(app)
                .post('/api/backup')
                .send({ invalidData: true })
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toEqual({ error: 'Invalid backup request data' });
        });
    });
});
