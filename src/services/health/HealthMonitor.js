class HealthMonitor {
    constructor() {
        this.checks = new Map();
        this.status = new Map();
    }

    registerHealthCheck(name, check, interval = 60000) {
        this.checks.set(name, {
            check,
            interval,
            lastRun: null,
            status: 'unknown'
        });
        this.startCheck(name);
    }

    async startCheck(name) {
        const checkConfig = this.checks.get(name);
        setInterval(async () => {
            try {
                const result = await checkConfig.check();
                this.status.set(name, result);
                this.notifyStatusChange(name, result);
            } catch (error) {
                this.handleCheckError(name, error);
            }
        }, checkConfig.interval);
    }

    getSystemHealth() {
        return {
            overall: this.calculateOverallHealth(),
            services: Object.fromEntries(this.status)
        };
    }
}

export default HealthMonitor;
