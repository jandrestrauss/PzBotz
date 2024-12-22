class Settings {
    constructor() {
        this.settings = new Map();
        this.loadDefaults();
    }

    loadDefaults() {
        this.settings.set('network', {
            maxConnections: process.env.MAX_CONNECTIONS || 100,
            timeout: process.env.CONNECTION_TIMEOUT || 5000
        });

        this.settings.set('game', {
            maxPlayers: process.env.MAX_PLAYERS || 32,
            tickRate: process.env.TICK_RATE || 64
        });

        this.settings.set('performance', {
            cpuThreshold: process.env.CPU_THRESHOLD || 80,
            memoryThreshold: process.env.MEMORY_THRESHOLD || 90
        });
    }

    get(category, key) {
        return this.settings.get(category)?.[key];
    }

    set(category, key, value) {
        if (!this.settings.has(category)) {
            this.settings.set(category, {});
        }
        this.settings.get(category)[key] = value;
    }
}

module.exports = new Settings();
