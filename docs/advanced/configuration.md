# Advanced Configuration

## Custom Event Handlers
```javascript
// config/events.json
{
    "playerJoin": {
        "notification": true,
        "commands": [
            "servermsg 'Welcome {player}'",
            "additem {player} Base.WaterBottle 1"
        ]
    },
    "serverRestart": {
        "warnings": [15, 10, 5, 1],
        "backupBeforeRestart": true
    }
}
```

## Performance Tuning
```javascript
// config/performance.json
{
    "monitoring": {
        "intervalMs": 30000,
        "retentionDays": 7
    },
    "websocket": {
        "maxConnections": 100,
        "heartbeatMs": 5000
    },
    "cache": {
        "ttlSeconds": 300,
        "maxItems": 1000
    }
}
```
