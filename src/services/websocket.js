const WebSocket = require('ws');
const logger = require('../utils/logger');

class WebSocketManager {
    constructor() {
        this.connections = new Map();
    }

    handleConnection(socket) {
        this.connections.set(socket.id, socket);
        this.setupEventHandlers(socket);
    }

    setupEventHandlers(socket) {
        socket.on('open', () => this.handleOpen(socket));
        socket.on('message', (msg) => this.handleMessage(msg));
        socket.on('close', () => this.handleClose(socket));
        socket.on('error', (error) => this.handleError(error));
    }

    handleOpen(socket) {
        logger.info(`WebSocket connection opened: ${socket.id}`);
    }

    handleMessage(msg) {
        logger.info(`WebSocket message received: ${msg}`);
    }

    handleClose(socket) {
        this.connections.delete(socket.id);
        logger.info(`WebSocket connection closed: ${socket.id}`);
    }

    handleError(error) {
        logger.error(`WebSocket error: ${error}`);
    }
}

module.exports = new WebSocketManager();
