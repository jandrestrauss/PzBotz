const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { RateLimit } = require('rate-limiter-flexible');
const { getStats, getUsers, updateUserSettings, getLogs, listBackups, createBackup, sendServerCommand, getLanguages, setLanguage, getFeatures, updateFeature, getOptimizations, runOptimization, getDocs, updateDoc, getAlerts, updateAlert, getRateLimits, updateRateLimit, getDetailedStats } = require('../controllers/apiController');

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

router.post('/server/command', auth.requireRole('admin'), sendServerCommand);

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

router.get('/backups', auth.requireRole('admin'), listBackups);
router.post('/server/backup', auth.requireRole('admin'), createBackup);

// Localization endpoints
router.get('/localization/languages', getLanguages);
router.post('/localization/set', auth.requireRole('admin'), setLanguage);

// Feature enhancements endpoints
router.get('/features', getFeatures);
router.post('/features/:id/:action', auth.requireRole('admin'), updateFeature);

// Performance optimization endpoints
router.get('/optimizations', getOptimizations);
router.post('/optimizations/:id/run', auth.requireRole('admin'), runOptimization);

// Documentation endpoints
router.get('/docs', getDocs);
router.put('/docs/:id', auth.requireRole('admin'), updateDoc);

// Alert system endpoints
router.get('/alerts', getAlerts);
router.post('/alerts/:id/:action', auth.requireRole('admin'), updateAlert);

// Rate limiting endpoints
router.get('/rate-limits', getRateLimits);
router.put('/rate-limits/:id', auth.requireRole('admin'), updateRateLimit);

// Advanced statistics endpoint
router.get('/stats/detailed', getDetailedStats);

// API endpoints
router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/settings', updateUserSettings);
router.get('/logs', getLogs);

module.exports = router;
