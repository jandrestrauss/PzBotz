const NodeCache = require('node-cache');

class Cache {
    constructor() {
        this.cache = new NodeCache({ stdTTL: 300 }); // 5 minutes default
    }

    set(key, value, ttl = 300) {
        return this.cache.set(key, value, ttl);
    }

    get(key) {
        return this.cache.get(key);
    }

    del(key) {
        return this.cache.del(key);
    }
}

module.exports = new Cache();