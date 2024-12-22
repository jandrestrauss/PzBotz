const express = require('express');
const router = express.Router();
const { authenticateSession } = require('../../utils/auth');
const serverStats = require('../../models/serverStats');
const playerStats = require('../../models/PlayerStats');

router.use(authenticateSession);

router.get('/overview', async (req, res) => {
    try {
        const stats = await serverStats.getOverviewStats();
        res.render('dashboard/overview', { stats });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

router.get('/players', async (req, res) => {
    try {
        const players = await playerStats.findAll();
        res.render('dashboard/players', { players });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

router.get('/status', async (req, res) => {
    try {
        const status = await serverStats.getCurrentStats();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get server status' });
    }
});

router.get('/players/:id/stats', async (req, res) => {
    try {
        const stats = await playerStats.findByPk(req.params.id);
        if (!stats) return res.status(404).json({ error: 'Player not found' });
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get player stats' });
    }
});

module.exports = router;
