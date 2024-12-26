class HealthCheck {
    constructor(rconHandler, discordClient) {
        this.rconHandler = rconHandler;
        this.discordClient = discordClient;
        this.healthHistory = [];
    }

    async checkDiscord() {
        try {
            return {
                status: this.discordClient.ws.status === 0 ? STATUS.HEALTHY : STATUS.UNHEALTHY,
                latency: this.discordClient.ws.ping
            };
        } catch (error) {
            return {
                status: STATUS.UNHEALTHY,
                error: error.message
            };
        }
    }

    async checkRcon() {
        try {
            await this.rconHandler.sendCommand('ping');
            return {
                status: STATUS.HEALTHY
            };
        } catch (error) {
            return {
                status: STATUS.UNHEALTHY,
                error: error.message
            };
        }
    }

    async checkSystem() {
        const usage = process.memoryUsage();
        return {
            status: STATUS.HEALTHY,
            memory: {
                heapUsed: usage.heapUsed,
                heapTotal: usage.heapTotal,
                external: usage.external
            },
            uptime: process.uptime()
        };
    }
}
