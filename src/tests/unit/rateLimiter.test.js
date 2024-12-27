const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');
const { rateLimitMiddleware } = require('../../security/rateLimiter');

const redisClient = redis.createClient({
  // ...existing code...
});

describe('Rate Limiter Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { ip: '127.0.0.1' };
        res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        next = jest.fn();
    });

    test('Should allow requests under the limit', () => {
        rateLimitMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test('Should block requests over the limit', () => {
        for (let i = 0; i < 101; i++) {
            rateLimitMiddleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(429);
        expect(res.send).toHaveBeenCalledWith('Too many requests');
    });
});
