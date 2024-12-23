class WebSocketManager {
  constructor() {
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect() {
    this.ws = new WebSocket(process.env.WS_URL);
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.ws.onclose = () => this.handleDisconnect();
    this.ws.onerror = (error) => this.handleError(error);
  }

  handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  handleError(error) {
    console.error('WebSocket error:', error);
    // Implement error logging
  }
}

module.exports = WebSocketManager;
