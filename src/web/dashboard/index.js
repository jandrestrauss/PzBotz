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
        const players = await playerStats.getAllPlayersStats();
        res.render('dashboard/players', { players });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

module.exports = router;
