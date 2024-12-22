const logger = require('../utils/logger');
const metrics = require('../monitoring/metrics');

class HealthCheck {
    constructor() {
        this.services = new Map();
        this.startInterval();
    }

    startInterval() {
        setInterval(() => this.checkAll(), 30000);
    }

    async checkAll() {
        const results = new Map();
        
        for (const [name, service] of this.services) {
            try {
                const status = await service.check();
                results.set(name, { status, timestamp: Date.now() });
                
                if (status !== 'healthy') {
                    logger.warn(`Service ${name} health check failed`);
                    this.handleUnhealthyService(name, service);
                }
            } catch (error) {
                logger.error(`Health check failed for ${name}:`, error);
                results.set(name, { status: 'error', error: error.message });
            }
        }

        metrics.updateHealthMetrics(results);
        return results;
    }

    handleUnhealthyService(name, service) {
        if (service.restart) {
            service.restart().catch(error => {
                logger.error(`Failed to restart ${name}:`, error);
            });
        }
    }
}

module.exports = new HealthCheck();
