# WebSocket Integration Guide

## Connection Setup
```javascript
// Client configuration
const WS_CONFIG = {
    reconnectInterval: 5000,
    maxRetries: 5,
    pingInterval: 30000
};

// Server events
const WS_EVENTS = {
    METRICS: 'metrics',
    PLAYER: 'player',
    SYSTEM: 'system',
    ALERT: 'alert'
};
```

## Message Format
```javascript
{
    type: 'EVENT_TYPE',
    timestamp: 1234567890,
    data: {
        // Event specific data
    },
    metadata: {
        version: '1.0.0',
        source: 'service_name'
    }
}
```

## Example Usage
```javascript
// Subscribe to metrics
ws.on(WS_EVENTS.METRICS, (data) => {
    updateDashboard(data);
});

// Send command
ws.send({
    type: 'COMMAND',
    data: { action: 'restart' }
});
```

## Error Handling
- Connection lost
- Message validation
- Rate limiting
- Reconnection logic
