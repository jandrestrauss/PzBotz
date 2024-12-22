const { WebSocket } = require('ws');
const metrics = require('../monitoring/metrics');

class WebSocketHandler {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Set();
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.wss.on('connection', (ws) => {
            this.handleConnection(ws);
        });
    }

    handleConnection(ws) {
        this.clients.add(ws);
        metrics.serverStats.playerCount.set(this.clients.size);

        ws.on('message', (msg) => this.handleMessage(ws, msg));
        ws.on('close', () => this.handleClose(ws));
        ws.on('error', (error) => this.handleError(ws, error));

        // Send initial state
        this.sendState(ws);
    }

    handleClose(ws) {
        this.clients.delete(ws);
        metrics.serverStats.playerCount.set(this.clients.size);
    }

    handleError(ws, error) {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
        metrics.serverStats.playerCount.set(this.clients.size);
    }

    handleMessage(ws, message) {
        try {
            const data = JSON.parse(message);
            switch(data.type) {
                case 'GET_STATE':
                    this.sendState(ws);
                    break;
                case 'UPDATE':
                    this.broadcast(data);
                    break;
                default:
                    console.warn('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Message handling error:', error);
        }
    }

    broadcast(data) {
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
}

module.exports = WebSocketHandler;
