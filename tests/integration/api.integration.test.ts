import * as logger from '../../src/utils/logger';
import { BackupResult } from '../../src/types/backup';
import backupService from '../../src/services/backupService';
import request from 'supertest';
import app from '../../src/app'; // Ensure you have the app instance imported
import { pool as originalPool, DatabasePool } from '../../src/database/pool';
import dotenv from 'dotenv';

dotenv.config();
import { metrics } from '../../src/monitoring/advancedMetrics';

jest.mock('../../src/utils/logger', () => ({
    error: jest.fn(),
    info: jest.fn()
}));

jest.mock('../../src/services/backupService');

// Mock the database connection
jest.mock('../../src/database/pool', () => ({
    DatabasePool: jest.fn().mockImplementation(() => ({
        query: jest.fn().mockResolvedValue({ rows: [] }),
        end: jest.fn()
    })),
    // ...other db methods...
}));

describe('API Integration Tests', () => {
    let pool: DatabasePool;

    beforeAll(async () => {
        // Mock database connection
        try {
            pool = new DatabasePool({
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432'),
                database: 'testdb',
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error(`Database connection error: ${(error as Error).message}`);
            } else {
                logger.error('Unknown error during database connection');
            }
        }
    });

    afterAll(async () => {
        // Close database connection if needed
        if (pool) {
            await pool.end();
        }
    });

    beforeEach(() => {
        jest.clearAllMocks();
        (backupService.createBackup as jest.Mock).mockImplementation(async () => ({
            message: 'Backup created successfully',
            backupFile: 'backup_123.zip'
        }) as BackupResult);
        metrics.resetAll();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Endpoints', () => {
        test('POST /api/backup should create backup', async () => {
            const response = await request(app)
                .post('/api/backup')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Backup created successfully');
            expect(response.body.backupFile).toBeDefined();
            expect(logger.error).not.toHaveBeenCalled();
        }, 10000);
    });
});
