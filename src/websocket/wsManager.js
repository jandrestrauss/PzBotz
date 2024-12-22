const WebSocket = require('ws');
const logger = require('../utils/logger');
const { serverMetrics } = require('../monitoring/metrics');

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
        }, 5000);
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
}

module.exports = WebSocketManager;
