const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateRequest } = require('../utils/auth');
const logger = require('../utils/logger');
const playerStats = require('../playerStats');
const systemIntegration = require('../integration/systemIntegration');
const { permissionMiddleware } = require('../security/permissions');

router.use(authenticateRequest);

// Authentication middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

router.get('/stats', async (req, res) => {
    try {
        const stats = await global.serverStats.getCurrentStats();
        res.json(stats);
    } catch (error) {
        logger.error('Failed to get stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/players/:id/kick', csrfProtection, async (req, res) => { // import { csrfProtection } from 'your-csrf-middleware'
    try {
        const { id } = req.params;
        const { reason } = req.body;

        await global.serverControl.kickPlayer(id, reason);
        res.json({ success: true });
    } catch (error) {
        logger.error('Failed to kick player:', error);
        res.status(500).json({ error: 'Failed to kick player' });
    }
});

router.get('/backups', async (req, res) => {
    try {
        const backups = await global.backupSystem.listBackups();
        res.json(backups);
    } catch (error) {
        logger.error('Failed to list backups:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Server status endpoint
router.get('/status', authenticate, async (req, res) => {
    try {
        const status = await global.serverManager.getStatus();
        res.json(status);
    } catch (error) {
        logger.error('Failed to get server status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Player statistics endpoint
router.get('/players/:id/stats', authenticate, async (req, res) => {
    try {
        const stats = await playerStats.getPlayerStats(req.params.id);
        if (!stats) return res.status(404).json({ error: 'Player not found' });
        res.json(stats);
    } catch (error) {
        logger.error('Failed to get player stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Server management endpoints
router.post('/server/restart', authenticate, csrfProtection, async (req, res) => { // import { csrfProtection } from 'your-csrf-middleware'
    try {
        if (!req.user.isAdmin) return res.status(403).json({ error: 'Unauthorized' });
        await global.serverManager.restart();

        res.json({ message: 'Server restart initiated' });
    } catch (error) {
        logger.error('Failed to restart server:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/systems/status', 
    permissionMiddleware('VIEW_STATS'),
    async (req, res) => {
        const statuses = Array.from(systemIntegration.systems.entries())
            .map(([name, system]) => ({
                name,
                status: system.status,
                lastCheck: system.lastCheck
            }));
        res.json(statuses);
    }
);

router.post('/systems/:systemName/action',
    csrfProtection, // import { csrfProtection } from 'your-csrf-middleware'
    permissionMiddleware('SERVER_CONTROL'),
    async (req, res) => {
        const { systemName } = req.params;

        const { action, params } = req.body;
        
        const system = systemIntegration.systems.get(systemName);
        if (!system) {
            return res.status(404).json({ error: 'System not found' });
        }

        try {
            const result = await system.instance[action](params);
            res.json({ success: true, result });
        } catch (error) {
            logger.error(`Action failed for ${systemName}:`, error);
            res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;
