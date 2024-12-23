const WebSocket = require('ws');

const connectWebSocket = () => {
  const ws = new WebSocket('wss://your-websocket-server');

  ws.on('open', () => {
    console.log('WebSocket connection established');

  });

  ws.on('close', () => {
    console.log('WebSocket connection closed, attempting to reconnect...');
    setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    ws.close();
  });

  ws.on('message', (message) => {
    console.log('Received message:', message);
    // ...existing message handling code...
  });
};

connectWebSocket();
