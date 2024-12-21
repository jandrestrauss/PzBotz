const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { RateLimit } = require('rate-limiter-flexible');

const rateLimiter = new RateLimit({
    points: 10,
    duration: 60
});

router.get('/server/status', auth.requireRole('user'), async (req, res) => {
    try {
        const status = await req.app.serverManager.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/server/command', auth.requireRole('admin'), async (req, res) => {
    try {
        const { command } = req.body;
        const result = await req.app.rcon.sendCommand(command);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/players', auth.requireRole('user'), async (req, res) => {
    try {
        const players = await req.app.serverManager.getOnlinePlayers();
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/stats/server', auth.requireRole('user'), async (req, res) => {
    try {
        const stats = await req.app.db.models.ServerStats
            .findOne()
            .sort({ timestamp: -1 });
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/mod/update', auth.requireRole('admin'), async (req, res) => {
    try {
        const { modId } = req.body;
        await req.app.modManager.updateMod(modId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/backups', auth.requireRole('admin'), async (req, res) => {
    try {
        const backups = await req.app.serverManager.listBackups();
        res.json(backups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
