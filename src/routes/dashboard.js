const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth.requireRole('user'), async (req, res) => {
    try {
        const serverStatus = await req.app.serverManager.getStatus();
        const stats = await req.app.db.models.ServerStats
            .findOne()
            .sort({ timestamp: -1 });
        
        res.render('dashboard', {
            user: req.user,
            serverStatus,
            stats,
            title: 'Dashboard'
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

router.get('/players', auth.requireRole('user'), async (req, res) => {
    try {
        const players = await req.app.serverManager.getOnlinePlayers();
        res.render('players', {
            user: req.user,
            players,
            title: 'Players'
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

router.get('/mods', auth.requireRole('admin'), async (req, res) => {
    try {
        const mods = await req.app.modManager.listMods();
        res.render('mods', {
            user: req.user,
            mods,
            title: 'Mod Management'
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

router.get('/settings', auth.requireRole('admin'), async (req, res) => {
    try {
        const settings = await req.app.serverManager.getSettings();
        res.render('settings', {
            user: req.user,
            settings,
            title: 'Server Settings'
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

module.exports = router;
