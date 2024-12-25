# Integration Guide

## Service Integration

### Creating New Services
```javascript
const BaseService = require('./BaseService');

class CustomService extends BaseService {
    constructor() {
        super('CustomService');
    }

    async start() {
        // Initialize service
    }

    async stop() {
        // Cleanup
    }
}
```

### Event System Integration
```javascript
// Subscribe to events
eventManager.on('customEvent', async (data) => {
    // Handle event
});

// Emit events
eventManager.emit('customEvent', { 
    type: 'UPDATE',
    data: payload 
});
```

## WebSocket Integration
```javascript
// Custom message types
const MESSAGE_TYPES = {
    STATS_UPDATE: 'statsUpdate',
    PLAYER_EVENT: 'playerEvent',
    SERVER_EVENT: 'serverEvent'
};

// Message handler
ws.on('message', (data) => {
    const message = JSON.parse(data);
    handleMessage(message);
});
```
