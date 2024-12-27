export interface DatabaseMetrics {
    queryCount: number;
    avgQueryTime: number;
    errorRate: number;
}

class AdvancedMetrics {
    private queryStats = {
        count: 0,
        totalTime: 0,
        errors: 0
    };

    recordQuery(duration: number, success: boolean): void {
        this.queryStats.count++;
        this.queryStats.totalTime += duration;
        if (!success) {
            this.queryStats.errors++;
        }
    }

    incrementQueryCount(): void {
        this.queryStats.count++;
    }

    getMetrics(): DatabaseMetrics {
        return {
            queryCount: this.queryStats.count,
            avgQueryTime: this.queryStats.count ? this.queryStats.totalTime / this.queryStats.count : 0,
            errorRate: this.queryStats.count ? (this.queryStats.errors / this.queryStats.count) * 100 : 0
        };
    }

    reset(): void {
        this.queryStats = {
            count: 0,
            totalTime: 0,
            errors: 0
        };
    }
}

export const metrics = {
    queryCount: 0,
    errorRate: 0,
    resetAll() {
        this.queryCount = 0;
        this.errorRate = 0;
    },
    getMetrics() {
        return {
            queryCount: this.queryCount,
            errorRate: this.errorRate
        };
    },
    recordQuery(duration: number, success: boolean) {
        this.queryCount++;
        if (!success) {
            this.errorRate++;
        }
    }
};
