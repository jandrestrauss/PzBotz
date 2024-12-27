import { jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/web/app';
import { pool as originalPool, DatabasePool } from '../src/database/pool';
import dotenv from 'dotenv';

dotenv.config();
import { metrics } from '../src/monitoring/advancedMetrics';
import * as db from '../src/database/connection'; // Corrected import path

// Mock the database connection
jest.mock('../src/database/db', () => ({
    connect: jest.fn().mockImplementation(() => {
        throw new Error('connect ECONNREFUSED ::1:5432');
    }),
    // ...other db methods...
}));

describe('API Integration Tests', () => {
    let pool: DatabasePool = originalPool;

    beforeAll(async () => {
        // Mock database connection
        await db.connect();
    });

    afterAll(async () => {
        await pool.end();
    });

    beforeEach(() => {
        metrics.resetAll();
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
                .expect(404);

            expect(response.body).toHaveProperty('error', 'Not Found');
        });

        test('should handle invalid requests', async () => {
            const response = await request(app)
                .get('/api/invalid')
                .expect(400);

            expect(response.body).toHaveProperty('error', 'Bad Request');
        });
    });
});
