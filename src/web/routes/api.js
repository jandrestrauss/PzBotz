const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const playerSync = require('../../sync/playerSync');
const gameEconomy = require('../../integration/gameEconomy');

router.get('/sync/status', requireAdmin, (req, res) => {
    res.json({
        isRunning: !!playerSync.syncInterval,
        lastSync: playerSync.lastSync
    });
});

router.post('/sync/start', requireAdmin, csrfProtection, async (req, res) => { // import { csrfProtection } from 'your-csrf-middleware'
    try {
        await playerSync.startSync();
        res.json({ success: true, message: 'Sync started' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/economy/overview', requireAuth, async (req, res) => {
    try {
        const data = await gameEconomy.fetchGameEconomyData();
        res.json({
            totalPlayers: Object.keys(data.players).length,
            totalPoints: Object.values(data.playerPoints).reduce((a, b) => a + b, 0),
            topPlayers: Object.entries(data.playerPoints)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
