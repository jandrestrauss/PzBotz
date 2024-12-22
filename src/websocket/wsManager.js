const WebSocket = require('ws');
const logger = require('../utils/logger');
const { serverMetrics, advancedMetrics } = require('../monitoring/metrics');

class WebSocketManager {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Set();
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            this.handleConnection(ws);
            this.setupHeartbeat(ws);

            ws.on('message', (message) => this.handleMessage(ws, message));
            ws.on('close', () => this.handleDisconnection(ws));
        });

        // Broadcast server metrics every 5 seconds
        setInterval(() => {
            this.broadcast('metrics', serverMetrics.getMetrics());
            this.broadcast('advancedMetrics', advancedMetrics.getMetrics());
        }, 5000);
    }

    async shutdown() {
        this.wss.close(() => {
            logger.info('WebSocket server closed successfully');
        });
    }

    broadcast(type, data) {
        const message = JSON.stringify({ type, data });
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    handleMessage(ws, message) {
        try {
            const data = JSON.parse(message);
            // Handle different message types
            // ...message handling logic...
        } catch (error) {
            logger.logEvent(`WebSocket error: ${error.message}`);
        }
    }

    handleConnection(ws) {
        this.clients.add(ws);
        ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));
    }

    handleDisconnection(ws) {
        this.clients.delete(ws);
    }

    setupHeartbeat(ws) {
        ws.isAlive = true;
        ws.on('pong', () => ws.isAlive = true);

        const interval = setInterval(() => {
            if (ws.isAlive === false) return ws.terminate();
            ws.isAlive = false;
            ws.ping();
        }, 30000);

        ws.on('close', () => clearInterval(interval));
    }
}

module.exports = WebSocketManager;
