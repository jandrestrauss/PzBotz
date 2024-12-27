export class DatabasePoolMock {
    private queryCount: number = 0;
    private errorRate: number = 0;

    async query(sql: string): Promise<void> {
        this.queryCount++;
        // Simulate a successful query
    }

    getMetrics() {
        return {
            queryCount: this.queryCount,
            errorRate: this.errorRate,
        };
    }
}
