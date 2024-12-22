const WebSocket = require('ws');
const logger = require('./utils/logger');
const { ServerStats } = require('./models/serverStats');

class Dashboard {
    constructor() {
        this.stats = new ServerStats();
        this.wss = null;
        this.updateInterval = null;
    }

    // Complete real-time statistics
    async updateRealTimeStatistics() {
        try {
            const stats = await this.stats.getCurrentStats();
            if (this.wss) {
                this.wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'stats_update',
                            data: stats
                        }));
                    }
                });
            }
        } catch (error) {
            logger.error('Failed to update statistics:', error);
        }
    }

    // Initialize user management interface
    initUserManagementInterface() {
        this.app.get('/api/users', this.requireAdmin, async (req, res) => {
            try {
                const users = await this.userManager.getAllUsers();
                res.json(users);
            } catch (error) {
                logger.error('Failed to get users:', error);
                res.status(500).json({ error: 'Failed to get users' });
            }
        });

        // Add more user management endpoints
        this.app.post('/api/users/:id/ban', this.requireAdmin, async (req, res) => {
            try {
                const { id } = req.params;
                const { reason } = req.body;
                await this.userManager.banUser(id, reason);
                res.json({ success: true });
            } catch (error) {
                logger.error('Failed to ban user:', error);
                res.status(500).json({ error: 'Failed to ban user' });
            }
        });
    }

    start() {
        // Start WebSocket server
        this.wss = new WebSocket.Server({ port: process.env.WS_PORT });
        
        // Set up real-time updates
        this.updateInterval = setInterval(() => {
            this.updateRealTimeStatistics();
        }, 5000); // Update every 5 seconds
        
        logger.info('Dashboard started successfully');
    }

    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.wss) {
            this.wss.close();
        }
        logger.info('Dashboard stopped');
    }
}

module.exports = new Dashboard();
