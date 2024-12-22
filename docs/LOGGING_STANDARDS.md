# Logging Standards Guide

## Payment Logging

### Log Levels
```typescript
enum PaymentLogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    CRITICAL = 'critical'
}
```

### Required Fields
```json
{
  "standardFields": {
    "timestamp": "ISO8601",
    "level": "LogLevel",
    "transactionId": "string?",
    "userId": "string?",
    "action": "string",
    "status": "string",
    "provider": "string"
  }
}
```

### Sample Log Format
```javascript
const LOG_FORMAT = {
    payment: {
        pattern: '[%t] %level %action - txn:%txn user:%user %msg',
        fields: ['timestamp', 'level', 'action', 'transactionId', 'userId', 'message']
    }
};
```

## Retention Policy
1. Transaction Logs: 90 days
2. Debug Logs: 7 days
3. Error Logs: 180 days
4. Audit Logs: 365 days
