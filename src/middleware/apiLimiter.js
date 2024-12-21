const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const RedisManager = require('../cache/redisManager');
const logger = require('../utils/logger');

class ApiLimiter {
    constructor() {
        this.redis = new RedisManager();
        this.limiters = new Map();
        this.setupLimiters();
    }

    setupLimiters() {
        // Default API limiter
        this.limiters.set('default', rateLimit({
            store: new RedisStore({
                client: this.redis.redis,
                prefix: 'ratelimit:api:'
            }),
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // Limit each IP to 100 requests per windowMs
            message: 'Too many requests from this IP, please try again later.'
        }));

        // Admin API limiter
        this.limiters.set('admin', rateLimit({
            store: new RedisStore({
                client: this.redis.redis,
                prefix: 'ratelimit:admin:'
            }),
            windowMs: 60 * 60 * 1000, // 1 hour
            max: 1000, // Limit each IP to 1000 requests per windowMs
            message: 'Admin API rate limit exceeded.'
        }));

        // Webhook limiter
        this.limiters.set('webhook', rateLimit({
            store: new RedisStore({
                client: this.redis.redis,
                prefix: 'ratelimit:webhook:'
            }),
            windowMs: 1 * 60 * 1000, // 1 minute
            max: 30, // Limit each IP to 30 webhook requests per windowMs
            message: 'Webhook rate limit exceeded.'
        }));
    }

    getMiddleware(type = 'default') {
        const limiter = this.limiters.get(type);
        if (!limiter) {
            logger.warn(`Rate limiter type '${type}' not found, using default.`);
            return this.limiters.get('default');
        }
        return limiter;
    }

    async getLimiterStatus(ip, type = 'default') {
        try {
            const key = `ratelimit:${type}:${ip}`;
            const data = await this.redis.get(key);
            return {
                remaining: data ? data.remaining : null,
                reset: data ? new Date(data.reset) : null
            };
        } catch (error) {
            logger.error('Error getting rate limiter status:', error);
            return null;
        }
    }

    createCustomLimiter(options) {
        const {
            name,
            windowMs = 15 * 60 * 1000,
            max = 100,
            message = 'Rate limit exceeded.'
        } = options;

        if (!name) throw new Error('Limiter name is required');

        const limiter = rateLimit({
            store: new RedisStore({
                client: this.redis.redis,
                prefix: `ratelimit:${name}:`
            }),
            windowMs,
            max,
            message
        });

        this.limiters.set(name, limiter);
        return limiter;
    }
}

module.exports = new ApiLimiter();
