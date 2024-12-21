const Redis = require('ioredis');
const logger = require('../utils/logger');

class RedisManager {
    constructor(config = {}) {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD,
            ...config
        });

        this.redis.on('error', (error) => {
            logger.error('Redis connection error:', error);
        });

        this.redis.on('connect', () => {
            logger.info('Redis connected successfully');
        });
    }

    async get(key) {
        try {
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            logger.error(`Redis get error for key ${key}:`, error);
            return null;
        }
    }

    async set(key, value, ttl = 3600) {
        try {
            await this.redis.setex(key, ttl, JSON.stringify(value));
            return true;
        } catch (error) {
            logger.error(`Redis set error for key ${key}:`, error);
            return false;
        }
    }

    async delete(key) {
        try {
            await this.redis.del(key);
            return true;
        } catch (error) {
            logger.error(`Redis delete error for key ${key}:`, error);
            return false;
        }
    }

    async getCached(key, fetchFn, ttl = 3600) {
        let data = await this.get(key);
        if (!data) {
            data = await fetchFn();
            if (data) {
                await this.set(key, data, ttl);
            }
        }
        return data;
    }
}

module.exports = RedisManager;
