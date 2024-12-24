const WebSocket = require('ws');
const logger = require('../utils/logger');
const metricsReporter = require('./metricsReporter');
const healthCheck = require('./healthCheck');

class WebSocketServer {
    constructor() {
        this.wss = null;
        this.clients = new Set();
        this.updateInterval = null;
    }

    start(server) {
        this.wss = new WebSocket.Server({ server });
        
        this.wss.on('connection', (ws) => {
            this.handleConnection(ws);
        });

        this.startMetricsUpdate();
        logger.logEvent('WebSocket server started');
    }

    handleConnection(ws) {
        this.clients.add(ws);
        logger.logEvent('New WebSocket client connected');

        ws.on('message', (message) => {
            this.handleMessage(ws, message);
        });

        ws.on('close', () => {
            this.clients.delete(ws);
            logger.logEvent('WebSocket client disconnected');
        });

        // Send initial data
        this.sendMetrics(ws);
    }

    startMetricsUpdate() {
        this.updateInterval = setInterval(() => {
            this.broadcastMetrics();
        }, 5000);
    }

    async broadcastMetrics() {
        const metrics = await this.gatherMetrics();
        this.broadcast({
            type: 'metrics',
            data: metrics
        });
    }

    async gatherMetrics() {
        const health = await healthCheck.check();
        return {
            timestamp: Date.now(),
            health,
            metrics: metricsReporter.currentMetrics
        };
    }

    broadcast(data) {
        const payload = JSON.stringify(data);
        for (const client of this.clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        }
    }

    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.wss) {
            this.wss.close();
            logger.logEvent('WebSocket server stopped');
        }
    }
}

module.exports = new WebSocketServer();
