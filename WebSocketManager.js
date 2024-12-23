const WebSocket = require('ws');
const logger = require('../utils/logger');

class WebSocketManager {
  constructor() {
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(process.env.WS_URL);
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.ws.onopen = () => this.handleOpen();
    this.ws.onmessage = (message) => this.handleMessage(message);
    this.ws.onclose = () => this.handleDisconnect();
    this.ws.onerror = (error) => this.handleError(error);
  }

  handleOpen() {
    this.reconnectAttempts = 0;
    logger.info('WebSocket connection established');
  }

  handleMessage(message) {
    logger.info('Received message:', message.data);
    // Implement message handling logic
  }

  handleDisconnect() {
    logger.warn('WebSocket connection closed');
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        logger.info(`Reconnecting attempt ${this.reconnectAttempts}`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      logger.error('Max reconnect attempts reached');
    }
  }

  handleError(error) {
    logger.error('WebSocket error:', error);
    // Implement additional error handling logic if needed
  }
}

module.exports = WebSocketManager;
