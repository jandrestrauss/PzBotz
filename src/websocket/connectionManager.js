const WebSocket = require('ws');
const logger = require('../utils/logger');
const EventEmitter = require('events');

class WebSocketConnectionManager extends EventEmitter {
    constructor(server) {
        super();
        this.server = server;
        this.wss = null;
        this.heartbeatInterval = 30000; // 30 seconds
        this.reconnectTimeout = 5000;   // 5 seconds
        this.maxReconnectAttempts = 5;
        this.clients = new Map();
    }

    initialize() {
        this.wss = new WebSocket.Server({ server: this.server });
        
        this.wss.on('connection', this.handleConnection.bind(this));
        this.wss.on('error', this.handleServerError.bind(this));

        logger.info('WebSocket server initialized');
    }

    handleConnection(ws, req) {
        const clientId = this.generateClientId();
        this.clients.set(clientId, {
            ws,
            lastPing: Date.now(),
            isAlive: true
        });

        logger.info(`Client connected: ${clientId}`);

        ws.on('pong', () => this.handlePong(clientId));
        ws.on('message', (data) => this.handleMessage(clientId, data));
        ws.on('error', (error) => this.handleClientError(clientId, error));
        ws.on('close', () => this.handleClientDisconnect(clientId));

        // Send initial connection success
        this.sendToClient(clientId, {
            type: 'connection_established',
            clientId
        });

        // Start heartbeat
        this.startHeartbeat(clientId);
    }

    startHeartbeat(clientId) {
        const interval = setInterval(() => {
            const client = this.clients.get(clientId);
            if (!client) {
                clearInterval(interval);
                return;
            }

            if (!client.isAlive) {
                this.handleClientTimeout(clientId);
                clearInterval(interval);
                return;
            }

            client.isAlive = false;
            client.ws.ping();
        }, this.heartbeatInterval);
    }

    handlePong(clientId) {
        const client = this.clients.get(clientId);
        if (client) {
            client.isAlive = true;
            client.lastPing = Date.now();
        }
    }

    handleClientTimeout(clientId) {
        logger.warn(`Client ${clientId} timed out`);
        const client = this.clients.get(clientId);
        if (client) {
            client.ws.terminate();
            this.clients.delete(clientId);
        }
    }

    handleMessage(clientId, data) {
        try {
            const message = JSON.parse(data);
            this.emit('message', { clientId, message });
        } catch (error) {
            logger.error(`Invalid message from client ${clientId}:`, error);
        }
    }

    handleClientError(clientId, error) {
        logger.error(`Client ${clientId} error:`, error);
        this.clients.delete(clientId);
    }

    handleClientDisconnect(clientId) {
        logger.info(`Client disconnected: ${clientId}`);
        this.clients.delete(clientId);
    }

    handleServerError(error) {
        logger.error('WebSocket server error:', error);
        this.attemptReconnect();
    }

    sendToClient(clientId, data) {
        const client = this.clients.get(clientId);
        if (client && client.ws.readyState === WebSocket.OPEN) {
            try {
                client.ws.send(JSON.stringify(data));
            } catch (error) {
                logger.error(`Error sending to client ${clientId}:`, error);
            }
        }
    }

    broadcast(data, excludeClientId = null) {
        const payload = JSON.stringify(data);
        this.clients.forEach((client, clientId) => {
            if (clientId !== excludeClientId && client.ws.readyState === WebSocket.OPEN) {
                try {
                    client.ws.send(payload);
                } catch (error) {
                    logger.error(`Error broadcasting to client ${clientId}:`, error);
                }
            }
        });
    }

    generateClientId() {
        return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    cleanup() {
        if (this.wss) {
            this.wss.close(() => {
                logger.info('WebSocket server closed');
            });
        }
    }
}

module.exports = WebSocketConnectionManager;
