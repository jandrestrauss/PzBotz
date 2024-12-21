const os = require('os');
const disk = require('diskusage');
const pidusage = require('pidusage');

class ServerMonitor {
    constructor(wss) {
        this.wss = wss;
        this.interval = null;
    }

    start(intervalMs = 5000) {
        this.interval = setInterval(async () => {
            const stats = await this.getStats();
            this.broadcast(stats);
        }, intervalMs);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    async getStats() {
        const cpuUsage = os.loadavg()[0];
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const memUsage = ((totalMem - freeMem) / totalMem) * 100;
        
        const root = '/';
        const { total, free } = await disk.check(root);
        const diskUsage = ((total - free) / total) * 100;

        return {
            cpu: Math.round(cpuUsage * 100),
            memory: Math.round(memUsage),
            disk: Math.round(diskUsage),
            timestamp: Date.now()
        };
    }

    broadcast(data) {
        if (!this.wss) return;

        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'serverStats',
                    data
                }));
            }
        });
    }
}

module.exports = ServerMonitor;
