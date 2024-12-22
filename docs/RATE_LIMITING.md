# Rate Limiting Guide

## Payment Endpoints

### Limits By Route
```javascript
const RATE_LIMITS = {
    '/api/v1/transaction/create': {
        window: '1m',
        max: 10,
        perUser: true
    },
    '/api/v1/points/transfer': {
        window: '1h',
        max: 50,
        perUser: true
    },
    '/webhook/*': {
        window: '1s',
        max: 100,
        perIp: true
    }
};
```

### Response Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Cache Configuration
```javascript
const RATE_LIMIT_CACHE = {
    store: 'redis',
    keyPrefix: 'rl:',
    ttl: 86400,
    cleanupInterval: 300
};
```
