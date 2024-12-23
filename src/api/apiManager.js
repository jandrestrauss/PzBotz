const express = require('express');
const router = express.Router();
const systemManager = require('../core/systemManager');
const { rateLimitMiddleware } = require('../security/rateLimiter');
const { permissionMiddleware } = require('../security/permissions');

class ApiManager {
    constructor() {
        this.setupRoutes();
        this.setupMiddleware();
    }

    setupRoutes() {
        router.get('/system/status', 
            rateLimitMiddleware,
            permissionMiddleware('VIEW_STATS'),
            (req, res) => {
                const status = Array.from(systemManager.systems.entries())
                    .map(([name, system]) => ({
                        name,
                        status: system.status || 'unknown'
                    }));
                res.json(status);
            });

        router.post('/system/control/:action',
            rateLimitMiddleware,
            permissionMiddleware('SERVER_CONTROL'),
            csrfProtection, // import { csrfProtection } from 'your-csrf-middleware'
            this.handleSystemControl.bind(this));
    }


    async handleSystemControl(req, res) {
        try {
            const result = await systemManager.executeAction(req.params.action);
            res.json({ success: true, result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ApiManager();
