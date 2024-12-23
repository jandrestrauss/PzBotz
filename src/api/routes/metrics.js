const express = require('express');
const router = express.Router();
const performanceMonitor = require('../../metrics/performanceMonitor');

router.get('/current', async (req, res) => {
    try {
        const metrics = await performanceMonitor.collectMetrics();
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/history', async (req, res) => {
    try {
        // Implementation for historical metrics
        res.json([]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
