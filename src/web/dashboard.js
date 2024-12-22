const express = require('express');
const { checkPermission } = require('../security/permissions');
const metrics = require('../metrics/collector');
const router = express.Router();

router.get('/stats', async (req, res) => {
    if (!checkPermission(req.user.id, 'VIEW_STATS')) {
        return res.status(403).json({ error: 'Permission denied' });
    }

    const stats = {
        server: await metrics.getServerStats(),
        players: await metrics.getPlayerStats(),
        system: await metrics.getSystemStats()
    };

    res.json(stats);
});

router.post('/commands', async (req, res) => {
    if (!checkPermission(req.user.id, 'EXECUTE_COMMANDS')) {
        return res.status(403).json({ error: 'Permission denied' });
    }

    try {
        const result = await gameIntegration.sendCommand(req.body.command);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
