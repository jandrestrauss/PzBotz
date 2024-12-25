const logger = require('../utils/logger');
const metricCollector = require('../services/metrics/metricCollector');
const alertManager = require('../services/alerts/alertManager');
const securityManager = require('../services/security/securityManager');
const recoveryManager = require('../services/recovery/recoveryManager');

class ServiceIntegrator {
    constructor() {
        this.services = new Map();
        this.isInitialized = false;
        this.setupServices();
        this.setupEventHandlers();
    }

    setupServices() {
        this.services.set('metrics', metricCollector);
        this.services.set('alerts', alertManager);
        this.services.set('security', securityManager);
        this.services.set('recovery', recoveryManager);
    }

    setupEventHandlers() {
        metricCollector.on('metricsCollected', ({ type, data }) => {
            alertManager.handleMetric(type, data);
        });

        alertManager.on('alert', (alert) => {
            if (alert.severity === 'CRITICAL') {
                recoveryManager.recover({ type: alert.metric, data: alert });
            }
        });
    }

    registerService(name, service) {
        this.services.set(name, service);
        logger.info(`Registered service: ${name}`);
    }

    async initializeServices() {
        for (const [name, service] of this.services) {
            try {
                if (service.initialize) {
                    await service.initialize();
                }
                logger.info(`Initialized service: ${name}`);
            } catch (error) {
                logger.error(`Failed to initialize service ${name}:`, error);
                throw error;
            }
        }
        this.isInitialized = true;
    }

    getService(name) {
        return this.services.get(name);
    }

    async start() {
        for (const [name, service] of this.services) {
            try {
                if (service.start) {
                    await service.start();
                    logger.info(`Started service: ${name}`);
                }
            } catch (error) {
                logger.error(`Failed to start service ${name}:`, error);
            }
        }
    }

    async stop() {
        for (const [name, service] of this.services) {
            try {
                if (service.stop) {
                    await service.stop();
                    logger.info(`Stopped service: ${name}`);
                }
            } catch (error) {
                logger.error(`Failed to stop service ${name}:`, error);
            }
        }
    }
}

module.exports = new ServiceIntegrator();
