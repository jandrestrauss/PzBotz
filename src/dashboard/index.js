const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const logger = require('../utils/logger');
const metricVisualizer = require('../visualization/metricVisualizer');
const serviceIntegrator = require('../core/serviceIntegrator');

class Dashboard {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });
        this.setupRoutes();
        this.setupWebSocket();
    }

    setupRoutes() {
        this.app.use(express.static(path.join(__dirname, 'public')));
        
        this.app.get('/api/metrics', async (req, res) => {
            const metrics = await serviceIntegrator.getService('metrics').getMetrics();
            res.json(metrics);
        });

        this.app.get('/api/health', async (req, res) => {
            const health = await serviceIntegrator.getService('health').checkHealth();
            res.json(health);
        });

        this.app.get('/api/chart/:type', async (req, res) => {
            const chart = await metricVisualizer.generateChart(req.params.type);
            res.type('image/png').send(chart);
        });
    }

    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            logger.info('Dashboard client connected');

            const metricsInterval = setInterval(async () => {
                const metrics = await serviceIntegrator.getService('metrics').getMetrics();
                ws.send(JSON.stringify({ type: 'metrics', data: metrics }));
            }, 5000);

            ws.on('close', () => {
                clearInterval(metricsInterval);
                logger.info('Dashboard client disconnected');
            });
        });
    }

    start(port = 3000) {
        this.server.listen(port, () => {
            logger.info(`Dashboard running on port ${port}`);
        });
    }
}

module.exports = new Dashboard();
