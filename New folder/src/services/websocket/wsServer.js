const WebSocket = require('ws');
const logger = require('../../utils/logger');
const metricCollector = require('../metrics/metricCollector');

class WebSocketServer {
    constructor() {
        this.clients = new Set();
        this.metricsInterval = null;
    }

    initialize(server) {
        this.wss = new WebSocket.Server({ server });
        
        this.wss.on('connection', (ws) => {
            this.handleConnection(ws);
        });

        this.startMetricsInterval();
        logger.info('WebSocket server initialized');
    }

    handleConnection(ws) {
        this.clients.add(ws);
        logger.info('Client connected to WebSocket');

        ws.on('message', (message) => this.handleMessage(ws, message));
        ws.on('close', () => this.handleDisconnect(ws));
        ws.on('error', (error) => this.handleError(ws, error));

        // Send initial data
        this.sendMetrics(ws);
    }

    handleMessage(ws, message) {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'subscribe':
                this.handleSubscribe(ws, data);
                break;
            case 'unsubscribe':
                this.handleUnsubscribe(ws, data);
                break;
            case 'command':
                this.handleCommand(ws, data);
                break;
            case 'playerJoin':
                this.handlePlayerJoin(ws, data);
                break;
            case 'playerLeave':
                this.handlePlayerLeave(ws, data);
                break;
            case 'serverStatus':
                this.handleServerStatus(ws, data);
                break;
            case 'alert':
                this.handleAlert(ws, data);
                break;
            case 'chatMessage':
                this.handleChatMessage(ws, data);
                break;
            default:
                logger.warn(`Unknown message type: ${data.type}`);
        }
    }

    handleSubscribe(ws, data) {
        ws.subscriptions = ws.subscriptions || new Set();
        ws.subscriptions.add(data.metric);
        logger.info(`Client subscribed to ${data.metric}`);
    }

    handleUnsubscribe(ws, data) {
        if (ws.subscriptions) {
            ws.subscriptions.delete(data.metric);
            logger.info(`Client unsubscribed from ${data.metric}`);
        }
    }

    handleCommand(ws, data) {
        // Handle command execution
        logger.info(`Received command: ${data.command}`);
        // Implement command handling logic here
    }

    handlePlayerJoin(ws, data) {
        // Handle player join event
        logger.info(`Player joined: ${data.player}`);
        // Implement player join handling logic here
    }

    handlePlayerLeave(ws, data) {
        // Handle player leave event
        logger.info(`Player left: ${data.player}`);
        // Implement player leave handling logic here
    }

    handleServerStatus(ws, data) {
        // Handle server status event
        logger.info(`Server status: ${data.status}`);
        // Implement server status handling logic here
    }

    handleAlert(ws, data) {
        // Handle alert event
        logger.info(`Alert: ${data.message}`);
        // Implement alert handling logic here
    }

    handleChatMessage(ws, data) {
        // Handle chat message event
        logger.info(`Chat message: ${data.message}`);
        // Implement chat message handling logic here
    }

    sendMetrics(ws) {
        try {
            const metrics = metricCollector.getMetrics();
            ws.send(JSON.stringify({ 
                type: 'metrics', 
                data: metrics
            }));
        } catch (error) {
            logger.error('Error sending metrics:', error);
        }
    }

    startMetricsInterval() {
        this.metricsInterval = setInterval(() => {
            try {
                const metrics = metricCollector.getMetrics();
                this.broadcast({
                    type: 'metrics',
                    data: metrics
                });
            } catch (error) {
                logger.error('Error in metrics interval:', error);
            }
        }, 5000);
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
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
        }
        for (const client of this.clients) {
            client.close();
        }
        if (this.wss) {
            this.wss.close();
        }
    }
}

module.exports = new WebSocketServer();
