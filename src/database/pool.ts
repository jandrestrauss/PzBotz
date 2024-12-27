import { Pool as PgPool, PoolConfig, QueryResult, QueryResultRow } from 'pg';
import { metrics } from '../monitoring/advancedMetrics';

export interface QueryOptions {
    text: string;
    values?: any[];
}

export class DatabasePool {
    private pool: PgPool;

    constructor(config?: PoolConfig) {
        this.pool = new PgPool(config || {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
    }

    async query<T extends QueryResultRow = any>(
        textOrConfig: string | QueryOptions, 
        values?: any[]
    ): Promise<QueryResult<T>> {
        const start = Date.now();
        try {
            const result = await this.pool.query<T>(textOrConfig, values);
            metrics.recordQuery(Date.now() - start, true);
            return result;
        } catch (error) {
            metrics.recordQuery(Date.now() - start, false);
            throw error;
        }
    }

    async end(): Promise<void> {
        await this.pool.end();
    }
}

export const pool = new DatabasePool();

export class DatabasePoolMock {
    private queryCount: number = 0;
    private errorRate: number = 0;

    async query(sql: string) {
        this.queryCount++;
        return Promise.resolve();
    }

    getMetrics() {
        return {
            queryCount: this.queryCount,
            errorRate: this.errorRate
        };
    }
}
