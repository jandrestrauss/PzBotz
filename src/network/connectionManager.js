const { PerformanceMonitor } = require('../utils/performance');
const logger = require('../logging/logger');

class ConnectionManager {
    constructor() {
        this.connections = new Map();
        this.stats = {
            active: 0,
            total: 0,
            failed: 0
        };
        this.monitor();
    }

    handleConnection(socket) {
        const id = Date.now().toString();
        const stopTimer = PerformanceMonitor.startTimer('connection');
        
        this.connections.set(id, {
            socket,
            timestamp: Date.now(),
            lastActivity: Date.now()
        });
        
        socket.on('close', () => this.handleDisconnect(id));
        socket.on('error', (error) => this.handleError(id, error));
        
        stopTimer();
        this.updateStats('connect');
    }

    monitor() {
        setInterval(() => {
            const now = Date.now();
            this.connections.forEach((conn, id) => {
                if (now - conn.lastActivity > 300000) { // 5 minutes
                    this.handleDisconnect(id);
                }
            });
        }, 60000);
    }
}

module.exports = new ConnectionManager();
