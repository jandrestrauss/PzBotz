class CacheManager {
    constructor() {
        this.cache = new Map();
        this.stats = new Map();
        this.maxSize = parseInt(process.env.CACHE_MAX_SIZE) || 1000;
        this.cleanupInterval = setInterval(() => this.cleanup(), 3600000);
    }

    async get(key, fetchFunction) {
        if (this.cache.has(key)) {
            this.updateStats(key, 'hit');
            return this.cache.get(key);
        }

        const value = await fetchFunction();
        this.set(key, value);
        this.updateStats(key, 'miss');
        return value;
    }

    updateStats(key, type) {
        const stats = this.stats.get(key) || { hits: 0, misses: 0 };
        stats[type === 'hit' ? 'hits' : 'misses']++;
        this.stats.set(key, stats);
    }
}

module.exports = new CacheManager();
