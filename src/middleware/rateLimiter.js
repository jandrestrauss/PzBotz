const { RateLimiterRedis } = require('rate-limiter-flexible');
const RedisManager = require('../cache/redisManager');
const logger = require('../utils/logger');
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const limiter = rateLimit({
  store: new RedisStore({
    client: redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

class GlobalRateLimiter {
    constructor() {
        this.redis = new RedisManager();
        this.limiters = {
            commands: this.createLimiter('commands', {
                points: 20,      // Number of points
                duration: 60,    // Per 60 seconds
                blockDuration: 60 // Block for 60 seconds if exceeded
            }),
            api: this.createLimiter('api', {
                points: 100,     // 100 requests
                duration: 300,   // Per 5 minutes
                blockDuration: 600 // Block for 10 minutes if exceeded
            }),
            wheel: this.createLimiter('wheel', {
                points: 3,       // 3 spins
                duration: 3600,  // Per hour
                blockDuration: 1800 // Block for 30 minutes if exceeded
            })
        };
    }

    createLimiter(name, options) {
        return new RateLimiterRedis({
            storeClient: this.redis.redis,
            keyPrefix: `ratelimit:${name}`,
            points: options.points,
            duration: options.duration,
            blockDuration: options.blockDuration,
            insuranceLimiter: this.createMemoryFallback(options)
        });
    }

    createMemoryFallback(options) {
        const { RateLimiterMemory } = require('rate-limiter-flexible');
        return new RateLimiterMemory({
            points: options.points,
            duration: options.duration
        });
    }

    async consume(key, type = 'commands') {
        try {
            const limiter = this.limiters[type];
            if (!limiter) {
                logger.warn(`Unknown rate limiter type: ${type}`);
                return { success: true };
            }

            await limiter.consume(key);
            return { success: true };
        } catch (error) {
            if (error.msBeforeNext) {
                return {
                    success: false,
                    msBeforeNext: error.msBeforeNext,
                    message: `Rate limit exceeded. Please wait ${Math.ceil(error.msBeforeNext / 1000)} seconds.`
                };
            }
            logger.error('Rate limiter error:', error);
            return { success: true }; // Fail open on errors
        }
    }

    async getRateLimitInfo(key, type = 'commands') {
        try {
            const limiter = this.limiters[type];
            if (!limiter) return null;

            const res = await limiter.get(key);
            return {
                remaining: res ? limiter.points - res.consumedPoints : limiter.points,
                reset: res ? new Date(Date.now() + res.msBeforeNext) : new Date(),
                total: limiter.points
            };
        } catch (error) {
            logger.error('Error getting rate limit info:', error);
            return null;
        }
    }
}

module.exports = new GlobalRateLimiter();
module.exports.limiter = limiter;
