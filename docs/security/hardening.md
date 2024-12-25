# Security Hardening Guide

## Critical Settings
```javascript
// Security configuration (security.config.js)
module.exports = {
    rateLimit: {
        windowMs: 15 * 60 * 1000,  // 15 minutes
        max: 100,                   // limit each IP to 100 requests per windowMs
        message: 'Too many requests, please try again later'
    },
    tokens: {
        rotationDays: 30,          // Token rotation schedule
        encryption: 'aes-256-gcm'   // Token encryption algorithm
    },
    audit: {
        enabled: true,
        logRetentionDays: 90
    }
};
```

## Access Controls
```javascript
// Permission matrix
const PERMISSIONS = {
    PUBLIC: ['VIEW_SERVER', 'USE_SHOP'],
    MOD: ['KICK_PLAYERS', 'BAN_PLAYERS'],
    ADMIN: ['MANAGE_SERVER', 'VIEW_LOGS'],
    OWNER: ['ALL']
};
```

## Secure Communication
1. RCON encryption
2. WebSocket TLS
3. Command validation
4. Input sanitization
