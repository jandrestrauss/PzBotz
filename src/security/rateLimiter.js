const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

const limiter = rateLimit({
    store: new RedisStore({
        client: redisClient,
        prefix: 'rate_limit:'
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

const rateLimitMiddleware = (req, res, next) => {
  const ip = req.ip;
  if (isRateLimited(ip)) {
    return res.status(429).send('Too many requests');
  }
  next();
};

const isRateLimited = (ip) => {
  const requests = getRequestsFromIP(ip);
  return requests > config.MAX_REQUESTS_PER_MINUTE;
};

module.exports = { limiter, rateLimitMiddleware };
