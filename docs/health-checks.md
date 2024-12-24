# Health Check System

## Health Indicators
```javascript
const HEALTH_CHECKS = {
    CRITICAL: [
        'database',
        'rcon',
        'discord'
    ],
    WARNING: [
        'cache',
        'metrics',
        'backup'
    ]
};

const STATUS = {
    HEALTHY: 'healthy',
    DEGRADED: 'degraded',
    UNHEALTHY: 'unhealthy'
};
```

## Implementation
```javascript
class HealthCheck {
    async check() {
        return {
            status: STATUS.HEALTHY,
            checks: {
                discord: await this.checkDiscord(),
                rcon: await this.checkRcon(),
                system: await this.checkSystem()
            },
            timestamp: Date.now()
        };
    }
}
```

## Monitoring
- Real-time status
- Historical data
- Alert thresholds
- Recovery actions
