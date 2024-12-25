const express = require('express');
const router = express.Router();
const serviceIntegrator = require('../../core/serviceIntegrator');
const logger = require('../../utils/logger');

router.get('/health', async (req, res) => {
    try {
        const metrics = await serviceIntegrator.getService('metrics').getMetrics();
        const services = Array.from(serviceIntegrator.services.entries())
            .map(([name, service]) => ({
                name,
                status: service.isRunning ? 'running' : 'stopped'
            }));

        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            metrics,
            services
        });
    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(500).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});

module.exports = router;
