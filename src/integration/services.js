const axios = require('axios');
const logger = require('../logging/logger');

class IntegrationServices {
    constructor() {
        this.services = new Map();
        this.healthChecks = new Map();
    }

    async registerService(name, config) {
        this.services.set(name, {
            config,
            status: 'initializing',
            lastCheck: Date.now()
        });

        await this.initializeService(name);
    }

    async healthCheck(serviceName) {
        const service = this.services.get(serviceName);
        if (!service) return false;

        try {
            const response = await axios.get(service.config.healthEndpoint);
            return response.status === 200;
        } catch (error) {
            logger.logEvent(`Health check failed for ${serviceName}`);
            return false;
        }
    }
}

module.exports = new IntegrationServices();
