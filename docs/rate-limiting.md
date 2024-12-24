# Rate Limiting Guide

## Configuration
```javascript
const RATE_LIMITS = {
    COMMANDS: {
        window: 60000,  // 1 minute
        max: 30
    },
    API: {
        window: 300000, // 5 minutes
        max: 100
    }
};
```

## Implementation
```javascript
class RateLimiter {
    check(userId, action) {
        const limit = RATE_LIMITS[action];
        // Rate limit logic
    }
}
```

## Recovery
1. Cooldown periods
2. Gradual recovery
3. Priority queuing
4. Override mechanisms
