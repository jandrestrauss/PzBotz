const EventEmitter = require('events');
const logger = require('../utils/logger');
const metrics = require('../monitoring/metrics');

class SystemIntegration extends EventEmitter {
    constructor() {
        super();
        this.systems = new Map();
        this.healthChecks = new Map();
        this.setupHealthChecks();
    }

    registerSystem(name, system) {
        this.systems.set(name, {
            instance: system,
            status: 'initializing',
            lastCheck: Date.now()
        });

        this.setupSystemMonitoring(name, system);
    }

    setupHealthChecks() {
        setInterval(() => {
            this.systems.forEach((system, name) => {
                this.checkSystemHealth(name);
            });
        }, 30000);
    }

    async checkSystemHealth(systemName) {
        const system = this.systems.get(systemName);
        try {
            const status = await system.instance.checkHealth();
            system.status = status;
            system.lastCheck = Date.now();
            metrics.recordSystemHealth(systemName, status);
        } catch (error) {
            logger.error(`Health check failed for ${systemName}:`, error);
        }
    }
}

module.exports = new SystemIntegration();
