class MetricsCollector {
    constructor() {
        this.store = new MetricsStore();
        this.analyzer = new MetricsAnalyzer();
    }

    async collect() {
        const metrics = {
            system: await this.collectSystemMetrics(),
            application: await this.collectAppMetrics(),
            user: await this.collectUserMetrics()
        };
        
        await this.store.save(metrics);
        return await this.analyzer.analyze(metrics);
    }

    async analyze() {
        const recentMetrics = await this.store.getRecent();
        return this.analyzer.generateReport(recentMetrics);
    }

    async report() {
        const analysis = await this.analyze();
        await this.notifyIfAnomalies(analysis);
        return analysis;
    }

    async recordError(error, context) {
        const errorMetrics = {
            type: error.name,
            context,
            timestamp: new Date(),
            stack: error.stack
        };

        await this.store.recordError(errorMetrics);
        await this.analyzer.checkErrorPatterns();
    }
}

export default MetricsCollector;
