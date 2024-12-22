const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Handle incoming messages
    // ...existing code...
  });

  ws.on('close', () => {
    // Handle connection close
    // ...existing code...
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    // Attempt to reconnect
    setTimeout(() => {
      reconnect(ws);
    }, 5000);
  });
});

const reconnect = (ws) => {
  if (ws.readyState === WebSocket.CLOSED) {
    // Logic to reconnect WebSocket
    // Example:
    const newWs = new WebSocket('ws://localhost:8080');
    newWs.on('open', () => {
      console.log('Reconnected to WebSocket server');
    });
    newWs.on('error', (error) => {
      console.error('Reconnection error:', error);
    });
  }
};

// ...existing code...
