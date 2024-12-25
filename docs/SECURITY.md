# Security Guide

## Core Security Measures

### Authentication
```javascript
// Token Management
TOKEN_ROTATION_DAYS = 30
TOKEN_ENCRYPTION = 'AES-256-GCM'

// Permission Levels
PERMISSION_LEVELS = {
    USER: 0,
    MOD: 1,
    ADMIN: 2,
    OWNER: 3
}
```

### Rate Limiting
```json
{
    "global": {
        "windowMs": 300000,
        "max": 100
    },
    "commands": {
        "windowMs": 60000,
        "max": 10
    }
}
```

### File Security
- Bot token stored in separate file
- Configuration encryption
- Secure backup storage
- Audit logging

## Best Practices
1. Regular token rotation
2. Encrypted configuration
3. Secure RCON connection
4. Permission validation
5. Input sanitization

## Monitoring
- Failed login attempts
- Command abuse detection
- Resource usage alerts
- Permission violations

## Permission Levels
```javascript
const PERMISSIONS = {
    USER: 0,      // Basic commands
    MOD: 1,       // Player management
    ADMIN: 2,     // Server control
    OWNER: 3      // Full access
};
```

## Rate Limiting
```javascript
const RATE_LIMITS = {
    COMMANDS: {
        windowMs: 60000,  // 1 minute
        max: 30          // requests
    },
    WHEEL_SPINS: {
        windowMs: 3600000, // 1 hour
        max: 5           // spins
    }
};
```

## Security Measures
1. Token storage in separate file
2. RCON password encryption
3. Command validation
4. Input sanitization
5. Error logging
