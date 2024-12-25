# Metrics Collection Guide

## Core Metrics
```javascript
// Metric types
const METRICS = {
    SYSTEM: {
        CPU: 'system.cpu',
        MEMORY: 'system.memory',
        DISK: 'system.disk'
    },
    APPLICATION: {
        COMMANDS: 'app.commands',
        RESPONSE_TIME: 'app.response_time',
        ERRORS: 'app.errors'
    },
    BUSINESS: {
        PURCHASES: 'business.purchases',
        POINTS: 'business.points',
        ACTIVE_USERS: 'business.users'
    }
};
```

## Collection Intervals
```javascript
// Collection frequency
const COLLECTION_CONFIG = {
    system: 30000,     // 30 seconds
    application: 60000, // 1 minute
    business: 300000    // 5 minutes
};
```

## Alert Configuration
```javascript
// Alert thresholds
const ALERT_CONFIG = {
    cpu: { warn: 70, critical: 90 },
    memory: { warn: 80, critical: 95 },
    errors: { warn: 5, critical: 10 }
};
