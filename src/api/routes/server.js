const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { validateToken } = require('../../security/tokenManager');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

router.use(apiLimiter);
router.use(validateToken);

router.get('/status', async (req, res) => {
    const status = await getServerStatus();
    res.json(status);
});

router.post('/command', async (req, res) => {
    const { command } = req.body;
    const result = await executeServerCommand(command);
    res.json(result);
});

router.get('/players', async (req, res) => {
    const players = await getOnlinePlayers();
    res.json(players);
});

router.get('/metrics', async (req, res) => {
    const metrics = await getServerMetrics();
    res.json(metrics);
});

module.exports = router;
